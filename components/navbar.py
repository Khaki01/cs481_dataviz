from dash import html
import dash_bootstrap_components as dbc

navbar = dbc.Navbar(children=[
    dbc.Row(
        [
            dbc.Col(dbc.Button(children=[html.I(className="bi bi-list")], outline=True, color="secondary",
                               className="mr-1", id="btn_sidebar")),
            dbc.Col(html.A(dbc.NavbarBrand("Navbar"), href="/", style={"textDecoration": "none"},))
        ],
        align="center"
    )
 ],
    color="light",
    className="p-3",
    dark=True
)
