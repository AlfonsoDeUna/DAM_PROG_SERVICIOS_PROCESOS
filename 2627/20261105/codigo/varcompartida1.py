import threading
import time
import random


def tarea(num):
    global total
    total = total + num
    
total = 0    
i = random.randint (1,10)
print (i)
t = threading.Thread (target = tarea, args= (i,))
i = random.randint (1,10)
print (i)
t2 = threading.Thread (target = tarea, args= (i,))
 
t.start()
t2.start()

print ("El total es : ", total)