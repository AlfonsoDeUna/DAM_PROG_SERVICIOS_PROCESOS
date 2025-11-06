import pygame

pygame.init()

SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Working With Rectangles")

rect_1 = pygame.Rect(200, 100, 150, 100)

run = True
while run:


  pygame.draw.rect(screen, (255, 0, 255), rect_1)

  for event in pygame.event.get():
   if event.type == pygame.QUIT:
      run = False


  pygame.display.flip()

pygame.quit()