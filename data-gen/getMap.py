# Creates a mapping from email to [batch, gender, rollNumber]
# Expects the files batches[i] and `{batches[i]}rolls` for all i
# Expects `{batches[i]}rolls` to contain a list of roll numbers
# and batches[i] to contain a list of email IDs copied from Outlook
# Run this after running getJSON.py
import json
try:
    with open("batches_to_genders.json") as fin:
        batches = json.load(fin)
except:
    print("batches_to_genders.json is invalid. You probably forgot to run getJSON.py")
    exit()
email_map = {}

def getRoll(email):
    parts = email.split("@")[0].split("_")
    for i in range(len(parts)):
        if parts[i].startswith("2") or parts[i].startswith("1"):
            return parts[i]
    return None

prev = 0
for batch in batches:
    f = open(batch)
    emails = [i[i.find('<')+1:i.find('>')] for i in f.read().split('; ')]
    f.close()

    for gender in batches[batch]:
        frolls = open(f"{batch}{gender}rolls")
        rolls = frolls.read()
        frolls.close()

        if rolls.startswith("["):
            rolls = eval(rolls)
        else:
            rolls = rolls.split()

        for roll in rolls:
            if not roll.isupper():
                print(roll)
            found = False
            for email in emails:
                try:
                    if getRoll(email).lower() == roll.lower():
                        found = True
                        if email in email_map: print(roll)
                        email_map[email] = { "batch": batch, "gender": gender, "rollNumber": roll.upper() }
                        break
                except:
                    print(email)
            if not found:
                print(roll)
        print(batch, gender, len(email_map)-prev)
        prev = len(email_map)

done = []
for batch in batches:
    f = open(batch)
    emails = [i[i.find('<')+1:i.find('>')] for i in f.read().split('; ')]
    f.close()

    ultimate_rolls = []

    for gender in batches[batch]:
        frolls = open(f"{batch}{gender}rolls")
        rolls = frolls.read()
        frolls.close()

        if rolls.startswith("["):
            rolls = eval(rolls)
        else:
            rolls = rolls.split()
        ultimate_rolls.extend(rolls)

    for email in emails:
        if getRoll(email).upper() not in ultimate_rolls:
            print(email)

with open("email_map.json", "w") as f:
    json.dump(email_map, f)
