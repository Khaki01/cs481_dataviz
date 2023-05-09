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
        )
    ],
    # dark=True,
    className="navbar-container"
    # id="sidenav-main",
)
