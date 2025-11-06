from random import random
import pygame



SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400

def circulosRandom():
    return (pygame.Color(random.randint(0,255), random.randint(0,255), random.randint(0,255)))



pygame.init()

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Working With Rectangles")

rect_1 = pygame.Rect(200, 100, 150, 100)

run = True
while run:


  pygame.draw.rect(screen, (255, 0, 255), rect_1)
  #dibuja un circulo de color random en la posicion 300,200 con radio 50
  #pygame.draw.circle(screen, circulosRandom(), (300, 200), 50)

  for event in pygame.event.get():
   if event.type == pygame.QUIT:
      run = False


  pygame.display.flip()

pygame.quit()