import json

# Function to parse and display attributes from the JSON structure
def parse_json_attributes(json_content):
    try:
        # Extracting the variable name and JSON content
        json_lines = json_content.split("=", 1)
        var_name = json_lines[0].strip().split()[-1]
        data = json.loads(json_lines[1].strip())

        # Displaying the parsed information
        print(f"Name: {var_name}")
        print("Attributes:")
        for key, value in data.items():
            if isinstance(value, list):
                print(f"{key}: {len(value)}")
            else:
                print(f"{key}: Not a list")
    except Exception as e:
        print(f"Error parsing JSON: {e}")

# Main execution flow
if __name__ == "__main__":
    file_path = input("Enter the path to the JSON file: ").strip()
    try:
        with open(file_path, 'r') as file:
            json_input = file.read()
        parse_json_attributes(json_input)
    except FileNotFoundError:
        print("Error: File not found. Please check the path and try again.")
    except Exception as e:
        print(f"An error occurred: {e}")
