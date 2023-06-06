import time

light_duration = {
    "green": 5,
    "yellow": 3,
    "red": 5
}

lights = ["green", "yellow", "red"]

light_1, light_2 = None, None

delay = 1

i = 0
elapsed_time = None
old = None
while True:
    light_1 = lights[i % len(lights)] 
    
    if not elapsed_time:
        # print(light_1)
        elapsed_time = time.time()
        if old == None:
            old = elapsed_time
    
    curr_time = time.time() - elapsed_time
    if curr_time >= light_duration[light_1]:
        i += 1
        elapsed_time = None
    
    if time.time() - old >= 1 or old == None:
        old = time.time()
        light_2 = "red"
        
        if light_1 == "green":
            light_2 = "red"
        elif light_1 == "red":
            light_2 = "green"
            
            if int(curr_time) + 1 >= light_duration["yellow"]:
                light_2 = "yellow"

        print(light_1, int(curr_time), light_2)