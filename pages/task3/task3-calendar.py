# Khaknazar
import json

import dash
import dash_bootstrap_components as dbc
from dash import ClientsideFunction, Input, Output, State, dcc, html

from components.calendar import calendar_container

dash.register_page(
    __name__,
    path="/calendar",
    title="Calendar",
    image="logo.png",
    description="Explore calendar",
)
phone_path = "assets/dataset/dataPhone.json"
with open(phone_path) as f:
    phonedata = json.load(f)
f.close()
activity_path = "assets/dataset/dataActivity.json"
with open(activity_path) as f:
    activitydata = json.load(f)
    # print(activitydata)
f.close()

dash.clientside_callback(
    ClientsideFunction(namespace="clientside", function_name="large_params_function"),
    Output("testDiv", "style", allow_duplicate=True),
    Input("big-battery-view", "n_clicks"),
    State("phoneStore", "data"),
    State("activityStore", "data"),
    prevent_initial_call=True,
)


battery_layout = html.Div(
    [
        html.Div(
            [],
            className="battery-head",
        ),
        html.Div(
            [
                html.Div(
                    [],
                    id="charge",
                    className="charge",
                ),
                html.Div(
                    [
                        html.Div([], id="charge-inner", className="charge-inner"),
                    ],
                    id="battery-body-inner",
                    className="battery-body-inner",
                ),
            ],
            id="battery-body",
            className="battery-body",
        ),
    ],
    className="battery",
    id="big-battery-view",
)


layout = html.Div(
    [
        html.Div(
            [
                battery_layout,
                html.Div(
                    [
                        html.Div(
                            [
                                html.Div(
                                    [
                                        html.H4("Phone usage"),
                                        html.H4(
                                            "51%",
                                            id="phone-percentage-text",
                                            className="dashboard-text",
                                        ),
                                    ],
                                    className="phone-container",
                                ),
                                html.Div(
                                    [
                                        html.H4("Physical Activity"),
                                        html.H4(
                                            "51%",
                                            id="activity-percentage-text",
                                            className="dashboard-text",
                                        ),
                                    ],
                                    className="activity-container",
                                ),
                            ]
                        ),
                        html.Div(
                            [
                                html.Div(
                                    [
                                        html.H4("Burned Calorie:"),
                                        html.H4(
                                            "2000/3000 kcal",
                                            id="total-calories-text",
                                            className="dashboard-text",
                                        ),
                                    ],
                                    className="activity-container",
                                ),
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.H4("Running"),
                                                html.H4(
                                                    "10min",
                                                    id="running-text",
                                                    className="dashboard-text",
                                                ),
                                            ],
                                            className="ml-2",
                                        ),
                                        html.Div(
                                            [
                                                html.H4("Gym"),
                                                html.H4(
                                                    "1500 kcal",
                                                    id="gym-calories-text",
                                                    className="dashboard-text",
                                                ),
                                            ],
                                            className="ml-2",
                                        ),
                                        html.Div(
                                            [
                                                html.H4("Steps"),
                                                html.H4(
                                                    "500",
                                                    id="steps-count-text",
                                                    className="dashboard-text",
                                                ),
                                            ],
                                            className="ml-2",
                                        ),
                                    ],
                                    className="activity-container",
                                ),
                                html.Div(
                                    [
                                        html.H4("Phone Usage:"),
                                        html.H4(
                                            "3 hours 13 min",
                                            id="phone-hours-text",
                                            className="dashboard-text",
                                        ),
                                    ],
                                    className="phone-container",
                                ),
                            ]
                        ),
                    ],
                    className="result-outer",
                ),
            ],
            className="task3-main-dashboard",
        ),
        calendar_container,
        html.Div(
            [],
            id="testDiv",
            className="hidden",
        ),
        dcc.Store(id="phoneStore", data=phonedata),
        dcc.Store(id="activityStore", data=activitydata),
    ],
    className="main-task3",
)
