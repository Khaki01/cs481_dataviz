import random
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output, State

# Generate random data for each day of the week
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
data1 = [random.randint(1, 10) for _ in range(7)]
data2 = [random.randint(1, 10) for _ in range(7)]

# Create the app layout
app = dash.Dash(__name__)
app.layout = html.Div(children=[
    html.H1(children='Weekly Sales'),
    dcc.Graph(
        id='graph-1',
        figure={
            'data': [{'x': days, 'y': data1, 'type': 'bar'}],
            'layout': {'title': 'Graph 1'}
        }
    ),
    dcc.Graph(
        id='graph-2',
        style={'display': 'none'},
        figure={
            'data': [{'x': days, 'y': data2, 'type': 'bar'}],
            'layout': {'title': 'Graph 2'}
        }
    )
])

# Callback to show/hide graph 2 when clicking on graph 1
@app.callback(
    Output('graph-2', 'style'),
    Input('graph-1', 'clickData'),
    State('graph-2', 'style')
)
def show_hide_graph(clickData, style):
    if clickData is not None and clickData['points'][0]['x'] == 'Monday':
        # Get the index of the clicked bar
        bar_index = clickData['points'][0]['pointIndex']
        # Show graph 2 and update its data with the selected bar data
        style['display'] = 'block'
        data = [{'x': ['Sales'], 'y': [data1[bar_index], data2[bar_index]], 'type': 'bar'}]
        return {'display': 'block', 'data': data}
    else:
        # Hide graph 2 if there's no click data or the clicked bar is not Monday
        return {'display': 'none'}

if __name__ == '__main__':
    app.run_server(debug=True)
