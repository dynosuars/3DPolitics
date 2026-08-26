import os
import shutil
import subprocess
import time

def convert(inp : str, con : str) -> None:
    subprocess.run(['ffmpeg', '-i', inp, inp.replace(os.path.splitext(inp)[1], '.' + con)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    shutil.move(inp.replace(os.path.splitext(inp)[1], '.' + con), os.getcwd() + "/assets/images/")
    os.remove(inp)
    print(f"Converted {inp} to {con} and moved to assets/images/")


def main():
    while True:
        for file in os.listdir():
            if file.endswith(('.png', '.jpeg', '.bmp', '.webp', '.svg')):
                convert(file, 'jpg')
        time.sleep(5)

if __name__ == "__main__":
    main()
