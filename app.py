import json

import dash
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.express as px
from dash import dcc, html
from dash.dependencies import ClientsideFunction, Input, Output, State

from calendarUtils import hello

# from dash_extensions import DeferScript

# external CSS stylesheets
external_stylesheets = [
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    dbc.themes.BOOTSTRAP,
]
json_file_path = "assets/dataset/dataActivity.json"
with open(json_file_path) as f:
    jsondata = json.load(f)

app = dash.Dash(external_stylesheets=external_stylesheets)

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
    id="battery06052023",
)

calendar_container = dbc.Container(
    [
        html.Div(
            [
                html.Div(
                    [
                        html.H2(
                            "Calendar #004",
                            className="heading-section",
                        ),
                    ],
                    className="col-md-6 text-center mb-5",
                ),
            ],
            className="row justify-content-center",
        ),
        html.Div(
            [
                html.Div(
                    [
                        html.Div(
                            [],
                            className="content w-100",
                        ),
                        html.Div(
                            [
                                html.Div(
                                    [
                                        html.Span(
                                            className="left-button fa fa-chevron-left",
                                            id="prev",
                                        ),
                                        html.Span(
                                            className="year",
                                            id="label",
                                        ),
                                        html.Span(
                                            className="right-button fa fa-chevron-right",
                                            id="next",
                                        ),
                                    ],
                                    className="year-header",
                                ),
                                dbc.Table(
                                    [
                                        html.Tbody(
                                            [
                                                html.Tr(
                                                    [
                                                        html.Td(
                                                            "Jan", className="month"
                                                        ),
                                                        html.Td(
                                                            "Feb", className="month"
                                                        ),
                                                        html.Td(
                                                            "Mar", className="month"
                                                        ),
                                                        html.Td(
                                                            "Apr", className="month"
                                                        ),
                                                        html.Td(
                                                            "May", className="month"
                                                        ),
                                                        html.Td(
                                                            "Jun", className="month"
                                                        ),
                                                        html.Td(
                                                            "Jul", className="month"
                                                        ),
                                                        html.Td(
                                                            "Aug", className="month"
                                                        ),
                                                        html.Td(
                                                            "Sep", className="month"
                                                        ),
                                                        html.Td(
                                                            "Oct", className="month"
                                                        ),
                                                        html.Td(
                                                            "Nov", className="month"
                                                        ),
                                                        html.Td(
                                                            "Dec", className="month"
                                                        ),
                                                    ],
                                                    className="months-row",
                                                ),
                                            ],
                                        )
                                    ],
                                    class_name="months-table w-100",
                                ),
                                dbc.Table(
                                    [
                                        html.Tbody(
                                            [
                                                html.Tr(
                                                    [
                                                        html.Td("Sun", className="day"),
                                                        html.Td("Mon", className="day"),
                                                        html.Td("Tud", className="day"),
                                                        html.Td("Wed", className="day"),
                                                        html.Td("Thu", className="day"),
                                                        html.Td("Fri", className="day"),
                                                        html.Td("Sat", className="day"),
                                                    ],
                                                )
                                            ],
                                        )
                                    ],
                                    class_name="days-table w-100",
                                ),
                                html.Div(
                                    [
                                        dbc.Table(
                                            [
                                                html.Tbody(
                                                    className="tbody",
                                                )
                                            ],
                                            class_name="dates-table w-100",
                                        ),
                                    ],
                                    className="frame",
                                ),
                                html.Button(
                                    "Add Event",
                                    className="button",
                                    id="add-button",
                                ),
                            ],
                            className="calendar-container",
                        ),
                        html.Div(
                            [],
                            className="events-container",
                        ),
                        html.Div(
                            [
                                html.H2(
                                    "Add New Event",
                                    className="dialog-header",
                                ),
                                html.Form(
                                    [
                                        html.Div(
                                            [],
                                            className="form-container",
                                        ),
                                    ],
                                    className="form",
                                    id="form",
                                ),
                            ],
                            className="dialog",
                            id="dialog",
                        ),
                    ],
                    className="col-md-12",
                ),
            ],
            className="row",
        ),
    ],
    class_name="container",
)

app.layout = html.Div(
    [
        battery_layout,
        calendar_container,
        html.Div(
            [
                html.H2("asdf"),
                html.H2(id="testh2"),
            ],
            id="testDiv",
        ),
        dcc.Store(id="ss-idx", data=jsondata),
    ],
    className="main",
)


app.clientside_callback(
    # """
    #     fetch("http://localhost:8050/dataset/dataPhone.json")
    # .then((response) => response.json())
    # .then((json) => {
    #   const interval = setInterval(function () {
    #     // method to be executed;
    #     batteryLog(battery, scores[key]);
    #     if (key < scores.length) key++;
    #     else key = 0;
    #   }, 3000);
    #   clearInterval(interval);
    #   console.log(json);
    # });
    #     """,
    ClientsideFunction(namespace="clientside", function_name="large_params_function"),
    Output("testh2", "children"),
    Input("testDiv", "n_clicks"),
    State("ss-idx", "data"),
    prevent_initial_call=True,
)
# def callback(n_clicks, style):
#     print(style)
#     hello()


if __name__ == "__main__":
    app.run_server(debug=True)
