
# =====================#
#                      #
#   READ INPUT DATA    #
#                      #
# =====================#

import json
import os

model_name = "Auto IO.json"
current_dir = os.path.dirname(os.path.abspath(__file__))
path_to_data = os.path.join(current_dir, model_name)
data = {}
with open(path_to_data) as f:
    data = json.load(f)
inputs = {} # { x : 10, y: 15,... } for arr of len 1; otherwise { x : [10,20,...], y: [15, 20,...],...}
for inputParam in data["inputParams"]:
    if len(inputParam["values"]) == 1:
        inputs[inputParam["name"]] = inputParam["values"][0]
    else:
        inputs[inputParam["name"]] = inputParam["values"]

# ==================#
#                   #
#   UPLOADED CODE   #
#                   #
# ==================#


def model(a, b):
  c = a + b
  return c


# ======================#
#                       #
#   WRITE OUTPUT DATA   #
#                       #
# ======================#

values_in_first_key_in_input_object = inputs[list(inputs.keys())[0]]
if type(values_in_first_key_in_input_object) == list:
    
    # output_result = [
    #    [result for outputParam 1 in row 1, result for outputParam 2 in row 1,...], 
    #    [result for outputParam 1 in row 2, result for outputParam 2 in row 2,...], 
    #     ......
    #  ]
    output_result = []
    for row_index, _ in enumerate(values_in_first_key_in_input_object):
        result = model(**{k: inputs[k][row_index] for k in list(inputs.keys())})
        output_result.append(list(result) if type(result) == tuple else [result])

    for col_index, outputParam in enumerate(data["outputParams"]):
        outputParam["values"] = []
        for row_index, _ in enumerate(values_in_first_key_in_input_object):
            outputParam["values"].append(output_result[row_index][col_index])

else:
    result = model(**inputs)
    output_result = list(result) if type(result) == tuple else [result]
    for outputParam in data["outputParams"]:
        outputParam["values"] = [output_result.pop(0)]

with open(path_to_data, "w") as f:
    json.dump(data, f) 
