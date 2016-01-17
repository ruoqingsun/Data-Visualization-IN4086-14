import numpy as np
import pandas as pd
#---------------------csv location------------------------------------------------
dataLocation = r'../../Data/master-distance.csv'
data_distance = pd.read_csv(dataLocation)
#---------------------group by----------------------------------------------------
data_distance_vhigh = data_distance[data_distance['Tier']=='VeryHigh']
distance_gb = data_distance_vhigh.groupby(['match','team','Win Lose','Tier'])
distance_mean = distance_gb['DD'].mean()
distance_var = distance_gb['DD'].var()
distance_std = distance_gb['DD'].std()
newdata_distance = pd.DataFrame({'mean' : distance_mean, 'var': distance_var, 'std': distance_std}).reset_index()

newdata_distance.to_csv('../../Data_Export/data_distance_vhigh.csv', sep='\t')

print(newdata_distance)