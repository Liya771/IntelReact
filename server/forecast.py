import os
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.io as pio
import json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# Generate 3 years (36 months) of historical revenue data with seasonality
np.random.seed(42)
dates = pd.date_range(start='2020-01-01', periods=36, freq='ME')
seasonality = np.sin(np.linspace(0, 6*np.pi, 36)) * 1000  # Simulated seasonal impact
random_noise = np.random.randint(-500, 500, size=36)  # Random variation
base_revenue = np.linspace(5000, 15000, 36)  # Increasing trend over time

data = {
    'ds': dates,
    'Revenue': base_revenue + seasonality + random_noise
}

df = pd.DataFrame(data)

# Normalize revenue data for better LSTM performance
scaler = MinMaxScaler(feature_range=(0, 1))
df['Revenue_scaled'] = scaler.fit_transform(df[['Revenue']])

# Prepare data for LSTM
sequence_length = 3  # Using past 3 months to predict next month
X, y = [], []
for i in range(len(df) - sequence_length):
    X.append(df['Revenue_scaled'].iloc[i:i+sequence_length].values)
    y.append(df['Revenue_scaled'].iloc[i+sequence_length])

X, y = np.array(X), np.array(y)
X = np.reshape(X, (X.shape[0], X.shape[1], 1))  # Reshape for LSTM input

# Build LSTM model
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(sequence_length, 1)),
    LSTM(50, return_sequences=False),
    Dense(25),
    Dense(1)
])

# Compile model
model.compile(optimizer='adam', loss='mean_squared_error')

# Train model
model.fit(X, y, epochs=50, batch_size=1, verbose=1)

# Predict future revenue (next 12 months)
predictions = []
input_seq = df['Revenue_scaled'].values[-sequence_length:].tolist()

for _ in range(12):
    input_array = np.array(input_seq).reshape(1, sequence_length, 1)
    predicted_value = model.predict(input_array)[0][0]
    predictions.append(predicted_value)
    input_seq.pop(0)
    input_seq.append(predicted_value)

# Convert predictions back to actual revenue
predicted_revenue = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
forecast_dates = pd.date_range(start=df['ds'].max() + pd.DateOffset(months=1), periods=12, freq='ME')
forecast = pd.DataFrame({'ds': forecast_dates, 'Revenue': predicted_revenue.flatten(), 'Type': 'Predicted'})

df['Type'] = 'Historical'
combined_df = pd.concat([df[['ds', 'Revenue', 'Type']], forecast], ignore_index=True)

# Calculate 3-month moving average
combined_df['Trend'] = combined_df['Revenue'].rolling(window=3, min_periods=1).mean()

# Ensure date format is consistent
combined_df['ds'] = combined_df['ds'].dt.strftime('%Y-%m')

# Plotly Interactive Line Chart
fig = px.line(
    combined_df, x='ds', y='Revenue', color='Type',
    title="📊 LSTM-Based Revenue Forecast with 3-Month Moving Average",
    labels={'ds': 'Date', 'Revenue': 'Revenue ($)'},
    color_discrete_map={'Historical': '#3498DB', 'Predicted': '#E74C3C'},
    hover_data={'Revenue': ':.2f'}
)

# Add Trend Line (Moving Average)
fig.add_scatter(
    x=combined_df['ds'], y=combined_df['Trend'],
    mode='lines', name='Trend (3-month avg)',
    line=dict(color='yellow', width=3, dash='dot')
)

# Enhance the Line Graph
fig.update_traces(mode="lines+markers", line=dict(width=3))

# Scrollable & Interactive Enhancements
fig.update_layout(
    xaxis=dict(
        title="📅 Month",
        tickangle=-45,
        rangeslider=dict(visible=True),
        type="category"
    ),
    yaxis=dict(title="💰 Revenue ($)"),
    plot_bgcolor="#2C3E50",
    paper_bgcolor="#34495E",
    font=dict(color="white", size=14),
    title_font=dict(size=20),
    legend=dict(bgcolor="#1F2C40", bordercolor="white", borderwidth=1)
)

# ✅ Save chart JSON in 'public' folder
public_folder = os.path.join(os.path.dirname(__file__), '..', 'public')
os.makedirs(public_folder, exist_ok=True)  # Ensure 'public' folder exists

json_file_path = os.path.join(public_folder, "forecast_chart.json")

with open(json_file_path, "w") as f:
    json.dump(pio.to_json(fig), f)

print(f"✅ Forecast chart JSON saved at: {json_file_path}")

fig.show()