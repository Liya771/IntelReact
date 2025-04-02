import psycopg2
import psycopg2.extensions
import json
from datetime import datetime, timedelta
import numpy as np
from sklearn.linear_model import LinearRegression
import select

def generate_chart():
    # Database connection for query
    conn = psycopg2.connect(
        host="localhost",
        database="IntelLogixAi",
        user="postgres",
        password="postgres"
    )
    cur = conn.cursor()

    # Fetch data
    query = """
    SELECT i.invoice_date::DATE, SUM(ii.total) AS total_revenue
    FROM invoices i
    JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
    GROUP BY i.invoice_date
    ORDER BY i.invoice_date ASC
    """
    cur.execute(query)
    rows = cur.fetchall()

    # Prepare historical data
    x_dates = [row[0] for row in rows]
    y_totals = [float(row[1]) if row[1] is not None else 0.0 for row in rows]


    # Convert dates to numeric values for regression
    base_date = x_dates[0]
    x_numeric = np.array([(date - base_date).days for date in x_dates]).reshape(-1, 1)
    y_totals = np.array(y_totals)

    # Train model
    model = LinearRegression()
    model.fit(x_numeric, y_totals)

    # Predict next 10 days
    last_date = x_dates[-1]
    future_dates = [last_date + timedelta(days=i) for i in range(1, 11)]
    future_numeric = np.array([(date - base_date).days for date in future_dates]).reshape(-1, 1)
    future_predictions = model.predict(future_numeric)

    # Format dates
    x_dates_str = [d.strftime("%Y-%m-%d") for d in x_dates]
    future_dates_str = [d.strftime("%Y-%m-%d") for d in future_dates]

    # Create chart data
    chart_data = {
        "data": [
            {"x": x_dates_str, "y": y_totals.tolist(), "type": "line", "marker": {"color": "blue"}, "name": "Historical Revenue"},
            {"x": future_dates_str, "y": future_predictions.tolist(), "type": "line", "marker": {"color": "red"}, "name": "Forecasted Revenue"}
        ],
        "layout": {
            "title": "Revenue Forecast (Next 10 Days)",
            "xaxis": {"title": "Date", "type": "date"},

            "yaxis": {"title": "Revenue ($)"}
        }
    }

    # Save to JSON
    with open("../public/forecast_chart.json", "w") as f:
        json.dump(chart_data, f, indent=4)

    cur.close()
    conn.close()
    print(f"✅ Chart updated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Set up listener connection
conn = psycopg2.connect(
    host="localhost",
    database="IntelLogixAi",
    user="postgres",
    password="postgres"
)
conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

# Listen for notifications
cur.execute("LISTEN invoice_updated;")
print("Listening for invoice updates...")

while True:
    if select.select([conn], [], [], 5) == ([], [], []):
        continue  # Timeout, keep listening
    conn.poll()
    while conn.notifies:
        notify = conn.notifies.pop(0)
        print(f"Invoice updated (ID: {notify.payload}). Regenerating chart...")
        generate_chart()