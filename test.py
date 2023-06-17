# import copy
# import random

# def getPri(a, penalty):
#     return random.randint(a, 2 ** penalty + 1)

# carList = [0, 0]

# for car_ID, Pri in enumerate(carList):
#     disicion = None
#     maxPri = Pri
#     countMax = 0
#     countDup = 0
#     penalty = 1
    
#     carListTemp = copy.deepcopy(carList)
#     carListTemp.pop(car_ID)

#     # print(carListTemp)
#     for carPri in carListTemp:
#         if carPri > maxPri:
#             countDup = 0
#             countMax += 1
#             # print("MAX")
#             maxPri = carPri
#         elif ((carPri == maxPri) and (maxPri == Pri)):
#             countDup += 1
    
#         # print(countMax)
#     if countMax == 0:
            
#         dicision = 0
#         if (countDup == 0):
#             penalty = 1
#         else:
#             penalty += 1
#             carList[car_ID] = getPri(Pri + 1, penalty)

#     elif (countMax == 1):
#         dicision = 1
#     else:
#         dicision = 2
    
#     print(car_ID, Pri)
#     print(dicision)
#     print(carList)
#     print("=============\n")

angle = -90 * 5

print(((angle % 360) + 360) % 360)