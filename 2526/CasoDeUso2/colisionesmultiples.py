import pygame
import random

pygame.init()

SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Collision")

#create main rectangle
rect_1 = pygame.Rect(0, 0, 25, 25)

#create empty list, then create 16 obstacle rectangles using a loop and add to list
obstacles = []
for _ in range(16):
  obstacle_rect = pygame.Rect(random.randint(0, 500), random.randint(0, 300), 25, 25)
  obstacles.append(obstacle_rect)

#define colours
BG = (50, 50, 50)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

#hide mouse cursor
pygame.mouse.set_visible(False)

run = True
while run:
  #update background
  screen.fill(BG)

  #check collision and change colour
  col = GREEN

  if rect_1.collidelist(obstacles) >= 0:
    print(rect_1.collidelist(obstacles))
    col = RED
##############################################################################################    
# Si quiero borrar un obstaculo al colisionar, descomentar el siguiente bloque
#    col = GREEN
# 1. Guarda el índice del obstáculo que colisiona
#    colliding_index = rect_1.collidelist(obstacles)

#    if colliding_index >= 0:
        # 2. Si hay colisión (índice no es -1)
#        col = RED # Cambia el color del rectángulo del ratón
        # 3. Elimina el obstáculo de la lista usando su índice
#        obstacles.pop(colliding_index)
##############################################################################################
  #get mouse coordinates and use them to position the rectangle
  pos = pygame.mouse.get_pos()
  rect_1.center = pos

  #draw all rectangles
  pygame.draw.rect(screen, col, rect_1)
  for obstacle in obstacles:
    pygame.draw.rect(screen, BLUE, obstacle)

  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      run = False

  #update display
  pygame.display.flip()

pygame.quit()