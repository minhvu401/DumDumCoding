from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

app = FastAPI()

# ------------------------------
# Định nghĩa schema dữ liệu
# ------------------------------

class HealthData(BaseModel):
    user_id: str
    date: str
    weight: float
    sleep_hours: float
    mood: str
    energy_level: int 
# ------------------------------
# Tải hoặc huấn luyện mô hình
# ------------------------------
class AnalysisRequest(BaseModel):
    data: HealthData
    historical_data: List[Dict]
try:
    model = joblib.load("health_model.pkl")
    print("✅ Model loaded successfully.")
except FileNotFoundError:
    print("⚠️  Model not found. Training a new one...")
    sample_data = [
        {"weight": 70.0, "sleep_hours": 7.0, "energy_level": 8, "status": "normal"},
        {"weight": 71.0, "sleep_hours": 5.0, "energy_level": 6, "status": "warning"},
        {"weight": 69.5, "sleep_hours": 8.0, "energy_level": 9, "status": "normal"},
        {"weight": 72.0, "sleep_hours": 4.5, "energy_level": 5, "status": "warning"},
    ]
    train_df = pd.DataFrame(sample_data)
    X = train_df[["weight", "sleep_hours", "energy_level"]]
    y = train_df["status"].map({"normal": 0, "warning": 1})
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    joblib.dump(model, "health_model.pkl")
    print("✅ Model trained and saved as 'health_model.pkl'.")

# ------------------------------
# Phân tích sức khỏe
# ------------------------------

def analyze_health(data: HealthData, historical_data: List[Dict]) -> Dict:
    print(f"📊 Analyzing for user {data.user_id} on {data.date}")
    
    today_df = pd.DataFrame([{
        "weight": data.weight,
        "sleep_hours": data.sleep_hours,
        "energy_level": data.energy_level,
    }])

    historical_df = pd.DataFrame(historical_data)

    # Dự đoán trạng thái hôm nay
    prediction = model.predict(today_df)
    status = "warning" if prediction[0] == 1 else "normal"

    # Tính xu hướng và gợi ý
    trends = {}
    suggestions = []
    if not historical_df.empty:
        last_week_avg = historical_df.tail(7).mean(numeric_only=True)

        trends["weight_change"] = round(data.weight - last_week_avg.get("weight", data.weight), 2)
        trends["sleep_change"] = round(data.sleep_hours - last_week_avg.get("sleep_hours", data.sleep_hours), 2)

        if trends["weight_change"] > 1:
            suggestions.append("⚠️ Cân nặng tăng đáng kể, hãy xem lại chế độ ăn.")
        if trends["sleep_change"] < -1:
            suggestions.append("⚠️ Thời gian ngủ giảm, ưu tiên nghỉ ngơi nhiều hơn.")

    if status == "warning":
        suggestions.append("⚠️ Tình trạng sức khỏe không ổn định. Hãy theo dõi và kiểm tra nếu cần.")

    if not suggestions:
        suggestions.append("✅ Tiếp tục duy trì lối sống lành mạnh!")

    result = {
        "status": status,
        "trends": trends,
        "suggestions": suggestions
    }

    print("✅ Analysis complete:", result)
    return result

# ------------------------------
# API endpoint: /analyze
# ------------------------------

@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    return analyze_health(request.data, request.historical_data)
