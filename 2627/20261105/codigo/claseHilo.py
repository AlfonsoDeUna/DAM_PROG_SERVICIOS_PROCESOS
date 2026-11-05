from threading import Thread

class Mihilo (Thread):
    def __init__(self):
        Thread.__init__(self)
        
    def run (self):
        print ("hola mundo")
        
if __name__ == "__main__":

    hilo = Mihilo()
    hilo.start()
    hilo.join()