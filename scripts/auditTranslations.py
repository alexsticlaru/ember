#Import os module
import os
import json

# Searches the given file for the specified string
def search_file(fname, search_str):
    # Open file for reading
    fo = open(fname)

    # Read the first line from the file
    line = fo.readline()

    # Initialize counter for line number
    line_no = 1

    # Loop until EOF
    while line != '' :
            # Search for string in line
            index = line.find(search_str)
            if ( index != -1) :
                return True

            # Read next line
            line = fo.readline()

            # Increment line counter
            line_no += 1
    # Close the file
    fo.close()
    return False

# Iterates through files in the repo, calling the search_file function looking for the specified string
def search_repo(search_str):
    found = False
    # Repeat for each file in the directory
    for root, dirs, files in os.walk("./app"):
        path = root.split(os.sep)
        # avoid searching in translations directory
        if (root != './app/locales'):
            for file in files:
                found = search_file(root + '/' + file, search_str)
                if (found):
                    return True;

    return False

# Recursive function to traverse input file and call search_repo function for each string found
def traverse_input_file(d, currString):
    retObj = {}

    for k, v in d.iteritems():
        # recursive case
        if isinstance(v, dict):
            contents = traverse_input_file(v, currString + k + '.')

            # avoid empty dicts
            if contents:
                retObj[k] = contents
        # non-recursive case
        else:
            found = search_repo((currString + k).encode("utf8"))
            if (found):
                retObj[k] = v.encode('utf8')
    return retObj


def main():
    fo = open('./app/locales/en/translations.js')
    data = fo.read()
    obj = data[data.find('{') : data.rfind('}')+1]
    inputObj = json.loads(obj)

    retObj = traverse_input_file(inputObj, '')

    # write to output json file
    with open('./app/locales/en/translation_audit_output.json', 'w') as outfile:
        json.dump(retObj, outfile, ensure_ascii = False, sort_keys = True)


main()
