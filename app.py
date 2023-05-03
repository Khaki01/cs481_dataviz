import dash
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.express as px
from dash import dcc, html
from dash.dependencies import Input, Output, State

from calendarUtils import hello

# from dash_extensions import DeferScript

# external CSS stylesheets
external_stylesheets = [
    # 'https://codepen.io/chriddyp/pen/bWLwgP.css',
    # {
    #     'href': 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
    #     'rel': 'stylesheet',
    #     'integrity': 'sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO',
    #     'crossorigin': 'anonymous'
    # }
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    dbc.themes.BOOTSTRAP,
]

app = dash.Dash(
    external_stylesheets=external_stylesheets
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
                            className="charge"
                        ),
                    ],
                    id="battery-body",
                    className="battery-body",
                ),
            ],
            className="battery",
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
                                                    id="next"
                                                )
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
                                                                    "Jan",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Feb",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Mar",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Apr",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "May",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Jun",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Jul",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Aug",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Sep",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Oct",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Nov",
                                                                    className="month"
                                                                ),
                                                                html.Td(
                                                                    "Dec",
                                                                    className="month"
                                                                )
                                                            ],
                                                            className="months-row"
                                                        ),
                                                    ],
                                                )
                                            ],
                                            class_name="months-table w-100"
                                        ),
                                        dbc.Table(
                                            [
                                                html.Tbody(
                                                    [
                                                        html.Tr(
                                                            [
                                                                html.Td(
                                                                    "Sun",
                                                                    className="day"
                                                                ),
                                                                html.Td(
                                                                    "Mon",
                                                                    className="day"
                                                                ),
                                                                html.Td(
                                                                    "Tud",
                                                                    className="day"
                                                                ),
                                                                html.Td(
                                                                    "Wed",
                                                                    className="day"
                                                                ),
                                                                html.Td(
                                                                    "Thu",
                                                                    className="day"
                                                                ),
                                                                html.Td(
                                                                    "Fri",
                                                                    className="day"
                                                                ),
                                                                html.Td(
                                                                    "Sat",
                                                                    className="day"
                                                                )
                                                            ],
                                                        )
                                                    ],
                                                )
                                            ],
                                            class_name="days-table w-100"
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
                )
            ],
            class_name="container"

        )

app.layout = html.Div(
    [
        battery_layout, 
        calendar_container,
    ],
    className="main",
)

@app.callback(
    Output("charge", "style"),
    Input("battery-body", "n_clicks"),
    State("charge", "style"),
    prevent_initial_call=True,
)
def callback(n_clicks, style):
    print(style)
    hello()
    # return {'width': '40%'}


if __name__ == '__main__':
    app.run_server(debug=True)