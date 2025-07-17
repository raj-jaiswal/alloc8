# Creates a mapping from email to [batch, gender, rollNumber
# Expects the files batches[i] and `{batches[i]}rolls` for all i
# Expects `{batches[i]}rolls` to contain a list of roll numbers
# and batches[i] to contain a list of email IDs copied from Outlook
import json
batches = ["btech22male", "btech23male", "btech24male", "phd19male", "phd20male", "phd22male", "btech23female", "btech24female"]
email_map = {}

def getRoll(email):
    parts = email.split("@")[0].split("_")
    for i in range(len(parts)):
        if parts[i].startswith("2") or parts[i].startswith("1"):
            return parts[i]
    return None

prev = 0
for batch in batches:
    f = open(batch.replace("female", "").replace("male", ""))
    emails = [i[i.find('<')+1:i.find('>')] for i in f.read().split('; ')]
    f.close()

    frolls = open(f"{batch}rolls")
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
                    email_map[email] = { "batch": batch.replace("female", "").replace("male", ""), "gender": "female" if batch.endswith("female") else "male", "rollNumber": roll.upper() }
                    break
            except:
                print(email)
        if not found:
            print(roll)
    print(batch, len(email_map)-prev)
    prev = len(email_map)

done = []
for batch in batches:
    batch = batch.replace("female", "").replace("male", "")
    if batch in done:
        continue
    done.append(batch)
    f = open(batch.replace("female", "").replace("male", ""))
    emails = [i[i.find('<')+1:i.find('>')] for i in f.read().split('; ')]
    f.close()

    ultimate_rolls = []

    for gender in "male", "female":
        try:
            frolls = open(f"{batch.replace("female", "").replace("male", "")}{gender}rolls")
            rolls = frolls.read()
            frolls.close()

            if rolls.startswith("["):
                rolls = eval(rolls)
            else:
                rolls = rolls.split()
            ultimate_rolls.extend(rolls)
        except: pass

    for email in emails:
        if getRoll(email).upper() not in ultimate_rolls:
            print(email)

with open("email_map.json", "w") as f:
    json.dump(email_map, f)
