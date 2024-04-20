import pandas as pd
import os

print ('#############################################')
print ('## concatenation of excel files program')
print ('## maedby : GeunSam2')
print ('## contact : rootiron96@gmail.com')
print ('#############################################')
print ('')

# 파일 경로 설정
base_dir = os.getcwd()
target_dir = os.path.join(base_dir, 'targets')
result_file = os.path.join(base_dir, 'result.csv')

if not os.path.exists(target_dir):
    print('targets folder does not exist. Please create a folder named "targets" and put the xlsx files in it.')
    exit()

# targets 폴더 내의 모든 xlsx 파일 찾기
files = [os.path.join(target_dir, file) for file in os.listdir(target_dir) if file.endswith('.xlsx')]

if len(files) == 0:
    print('there is no xlsx file in the targets folder. Please put the xlsx files in the targets folder.')
    exit()

if os.path.exists(result_file):
    print ("- result.xlsx already exist.")
    print ("- press 'new' to delete file and continue.")
    print ("- press 'append' to append the data to the existing file.")
    print ("- press any else to cancel the program.")
    inputKey = input('new / append / ..else : ')
    if inputKey == 'new':
        print('delete the existing file.')
        os.remove(result_file)
    elif inputKey == 'append':
        print('append the data to the existing file.')
        pass
    else:
        print('cancel the program.')
        exit()

print ('')
print ('## found %d files' % len(files))
print ('## start processing files...')

# 파일 스트림을 생성하고 첫 번째 파일 처리
first_file = True
for file in files:
    print('# processed:', file)
    # 데이터 로드 (첫 줄 제외)
    data = pd.read_excel(file, skiprows=1)
    data = data.iloc[:-1]  # 마지막 행 제거

    # 파일에 데이터 추가
    with open(result_file, 'a', newline='', encoding='utf-8') as f:
        data.to_csv(f, header=first_file, index=False)
        first_file = False  # 첫 파일 이후 헤더를 추가하지 않음

print ('')
print('## All files are processed!')