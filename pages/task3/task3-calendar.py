from components.calendar import calendar_container
import json

import dash
from dash import dcc, html, ClientsideFunction, Output, Input, State

dash.register_page(
    __name__,
    path='/calendar',
    title='Calendar',
    image='logo.png',
    description='Explore calendar'
)

json_file_path = "assets/dataset/dataActivity.json"
with open(json_file_path) as f:
    jsondata = json.load(f)

dash.clientside_callback(
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
    Output("testh2", "children", allow_duplicate=True),
    Input("testDiv", "n_clicks"),
    State("ss-idx", "data"),
    prevent_initial_call=True,
)

dash.clientside_callback(
    ClientsideFunction(namespace="clientside", function_name="large_params_function"),
    Output("testh2", "children", allow_duplicate=True),
    Input("testDiv", "n_clicks"),
    State("ss-idx", "data"),
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
    id="battery06052023",
)


layout = html.Div(
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