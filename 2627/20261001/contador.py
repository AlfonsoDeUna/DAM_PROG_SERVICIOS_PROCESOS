# contador.py

import os
import time


print("CONTADOR | Mi PID es:", os.getpid(), flush=True)

for numero in range(1, 11):
    print("CONTADOR | Número:", numero, flush=True)
    time.sleep(1)

print("CONTADOR | He terminado.", flush=True)