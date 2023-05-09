import numpy as np
import random

# Task 1 health activity

days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
running = [500, 600, 800, 700, 900, 750, 850]
cycling = [350, 400, 500, 450, 550, 600, 700]
workout = [600, 700, 650, 800, 750, 700, 900]
goal = [100, 312, 550, 816, 1114, 1447, 1819]
done = np.add(running, np.add(cycling, workout))

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
