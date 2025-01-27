import numpy as np
import pandas as pd
import random
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
import tensorflow as tf
seed = 42
np.random.seed(seed)
random.seed(seed)
tf.random.set_seed(seed)
tf.config.experimental.enable_op_determinism()
df=pd.read_csv('/content/PPE_Kit_Availability_Dataset.csv')
df=df.drop(columns=['Hospital_Type'])
df=df.drop(columns=['Number_of_Patients'])
df=df.drop(columns=['Avg_Patient_Load_Last_Month'])
df=df.drop(columns=['Hospital_Location'])
df=df.drop(columns=['Budget_Allocation_for_PPE'])
X=df.drop(columns=['PPE_Kits_Available'])
y=df['PPE_Kits_Available']
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=seed)
model=LinearRegression()
model.fit(X_train,y_train)
training_data_prediction=model.predict(X_train)
training_data_accuacy=r2_score(y_train,training_data_prediction)
#print(training_data_accuacy)
testin_data_prediction=model.predict(X_test)
testin_data_accuacy=r2_score(y_test,testin_data_prediction)
#print(testin_data_accuacy)
y_preds=model.predict(X_test)
#plt.scatter(X_train.iloc[:,0],y_train,c='b',label='training data')
#plt.scatter(X_test.iloc[:,0],y_test,c='g',label='testing data')
#plt.scatter(X_test.iloc[:,0],y_preds,c='r',label='predicted values')
#plt.legend()
#plt.show()
model=tf.keras.Sequential({
    tf.keras.layers.Dense(100,activation='relu')
    ,tf.keras.layers.Dense(100,activation='relu')
    ,tf.keras.layers.Dense(100,activation='relu')
    ,tf.keras.layers.Dense(1,activation='relu') 
})
model.compile(loss=tf.keras.losses.mae,
              optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
              metrics=['mae'])
history=model.fit(X_train,y_train,epochs=100,verbose=0,shuffle=False)
model.evaluate(X_test,y_test)
pd.DataFrame(history.history).plot()
plt.ylabel('loss')
plt.xlabel('epochs')
plt.show()
test_loss,test_mae=model.evaluate(X_test,y_test)
print(test_loss)
print(test_mae)
