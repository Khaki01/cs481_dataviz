import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html
from dash.dependencies import Input, Output, State

app = dash.Dash(__name__)

app.layout = html.Div(
    [
        html.Div(
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
        ),
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
    return {'width': '40%'}


if __name__ == '__main__':
    app.run_server(debug=True)