import numpy as np
import random


days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

# Task 1 phone usage

goal_phone_usage = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
insta = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
kakao = [0.1, 0.3, 0.4, 0.6, 1.5, 0, .35]
utub = [1, 1.2, 1.5, 1.4, 0.2, 0.3, 1.]
tiktok = [0.2, 0.2, 0.5, 0.4, 0.6, 0.3, 0.4]
done_phone_usage = np.add(kakao, np.add(insta, np.add(tiktok, utub)))

# Task 1 health activity

running = [500, 600, 800, 700, 900, 750, 850]
cycling = [350, 400, 500, 450, 550, 600, 700]
workout = [600, 700, 650, 800, 750, 700, 900]
goal_health_activity = [100, 312, 550, 816, 1114, 1447, 1819]
done_health_activity = np.add(running, np.add(cycling, workout))

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
