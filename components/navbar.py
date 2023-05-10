# Olzhas
import dash_bootstrap_components as dbc
from dash import html

navbar = dbc.Navbar(
    children=[
        dbc.Row(
            [
                dbc.Col(
                    dbc.Button(
                        children=[html.I(className="bi bi-list")],
                        outline=True,
                        color="secondary",
                        # className="mr-1",
                        id="btn_sidebar",
                        style={"display": "none"},
                    )
                ),
                dbc.Col(
                    html.A(
                        dbc.NavbarBrand("Navbar"),
                        href="/",
                        style={"textDecoration": "none"},
                    )
                ),
            ],
            # align="center",
            class_name="navbar-container-inner",
            style={"display": "none"},
        )
    ],
    # dark=True,
    className="navbar-container"
    # id="sidenav-main",
)
