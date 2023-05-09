import numpy as np
import random

# App usage data
app_names = ['Instagram', 'Kakao talk', 'Youtube', 'Tiktok']
app_data = [[random.randint(12, 40) for j in range(60)] for i in range(4)]

app_data_total = np.sum(app_data, axis=0)


# Physical activities data
activities_names = ["Cycling", "Running", "Workout"]
activities_data = [[random.randint(15, 30) for x in range(60)] for y in range(3)]

app_data_total_by_category = np.sum(app_data, axis=0)

activities_data_total = np.sum(activities_data, axis=0)

# Pie chart data
piechart_values = np.sum(app_data, axis=1)

# Line bar data
linebar_values = np.sum(activities_data, axis=1)
