import pygame

pygame.init()

SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Working With Rectangles")
soldier = pygame.image.load("./soldier.png").convert_alpha()

rect_1 = pygame.Rect(200, 100, 150, 100)
rect_2 = soldier.get_rect()

run = True
while run:


  print(rect_2)

  pygame.draw.rect(screen, (255, 0, 255), rect_1)
  pygame.draw.rect(screen, (0, 255, 255), rect_2)

  for event in pygame.event.get():
   if event.type == pygame.QUIT:
      run = False

  # movimientos del jugador
 
  pygame.draw.rect(screen, (0, 255, 255), rect_2)  
  # si quiero que algo aparezca en pantalla neecesito dibujarlo.
  # screen.blit(soldier, (0, 0))
  # screen.blit(soldier, rect_2)    

  pygame.display.flip()

pygame.quit()