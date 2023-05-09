import dash_bootstrap_components as dbc
from dash import html

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
                    ],
                    className="col-md-12",
                ),
            ],
            className="row",
        ),
    ],
    class_name="container-task3",
)
