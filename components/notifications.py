import dash_bootstrap_components as dbc
import dash
from dash import Input, Output, State, html, callback

notifications = html.Div(
    [
        dbc.Button("Open modal1", id="open1", n_clicks=0, className="mr-2"),
        dbc.Button("Open modal2", id="open2", n_clicks=0, className="mr-2"),
        dbc.Button("Open modal3", id="open3", n_clicks=0),
        dbc.Modal(
            [
                dbc.ModalFooter(
                    [
                        html.Img(src="https://cdn-icons-png.flaticon.com/512/2550/2550322.png", height=30),
                        html.P("You just charged 5% by taking a walk! Well done!"),
                        dbc.Button(
                            "X", id="close1", className="ms-auto", n_clicks=0
                        )
                    ]
                ),
            ],
            id="modal1",
            is_open=False,
            className="custom-modal1",
            style={"backgroundColor": "#f7f7f7"}
        ),
        dbc.Modal(
            [
                dbc.ModalFooter(
                    [
                        html.Img(src="https://icons.iconarchive.com/icons/danrabbit/elementary/128/Button-hint-icon.png", height=30),
                        html.P("Do not forget to take a walk during the sunlight"),
                        dbc.Button(
                            "X", id="close2", className="ms-auto", n_clicks=0
                        )
                    ]
                ),
            ],
            id="modal2",
            is_open=False,
            className="custom-modal2",
            style={"backgroundColor": "#f7f7f7",}
        ),
        dbc.Modal(
            [
                dbc.ModalFooter(
                    [
                        html.Img(src="https://cdn-icons-png.flaticon.com/512/458/458594.png", height=30),
                        html.P("You just used 5% for Instagram! It is time to exercise!"),
                        dbc.Button(
                            "X", id="close3", className="ms-auto", n_clicks=0
                        )
                    ]
                ),
            ],
            id="modal3",
            is_open=False,
            className="custom-modal3",
            style={"backgroundColor": "#f7f7f7"}
        ),
    ],style={"margin": "20px", "opacity": 0.5},
)

@callback(
    [Output("modal1", "is_open"),
     Output("modal2", "is_open"),
     Output("modal3", "is_open")],
    [Input("open1", "n_clicks"), Input("close1", "n_clicks"),
     Input("open2", "n_clicks"), Input("close2", "n_clicks"),
     Input("open3", "n_clicks"), Input("close3", "n_clicks")],
    [State("modal1", "is_open"), State("modal2", "is_open"), State("modal3", "is_open")],
)
def toggle_modal(*args):
    ctx = dash.callback_context
    if not ctx.triggered:
        return False, False, False

    button_id = ctx.triggered[0]["prop_id"].split(".")[0]

    if button_id == "open1":
        return True, False, False
    elif button_id == "close1":
        return False, False, False
    elif button_id == "open2":
        return False, True, False
    elif button_id == "close2":
        return False, False, False
    elif button_id == "open3":
        return False, False, True
    elif button_id == "close3":
        return False, False, False

    return False, False, False

