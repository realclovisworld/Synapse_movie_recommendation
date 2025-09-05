# 📦 Import required libraries
import pandas as pd #data manipulation {reading and writing csv.files}
import numpy as np #numerical computation{array ops, math funnctions}
import torch #GPU acceleration, tensor ops{GPU COMPUTATION, creating and manupulating tensor}
import torch.nn as nn #neural networks module in pytorch
from torch.utils.data import Dataset, DataLoader #data handling utilities
import random #generating random numbers.

# 📥 Step 1: Load TMDB movie metadata
movies = pd.read_csv("C:/Users/user/OneDrive/Desktop/movie recomendation/tmdb_5000_movies.csv")
movies = movies[['id', 'title', 'release_date']].dropna()
movies.columns = ['item_id', 'title', 'release_date']

# 🧪 Step 2: Simulate user ratings
num_users = 100 #sets no of stimulated users
ratings = [] #initializes an empty list to store rating dictionaries
for user_id in range(1, num_users + 1): #loops through user ids
    sampled = movies.sample(n=10)#randomly selects 10 movies
    for _, row in sampled.iterrows():#iterates over each sample movie
        ratings.append({
            'user_id': user_id,
            'item_id': row['item_id'],
            'rating': random.randint(1, 5)
        })#appends a dictionary

df = pd.DataFrame(ratings)#converts list of dictionaries into structured dataframe
df = df.merge(movies, on='item_id')#joins rating with movie metadata.

# 🔁 Step 3: Create ID mappings
user_map = {id: idx for idx, id in enumerate(df['user_id'].unique())}#maps each unique user_id to index
item_map = {id: idx for idx, id in enumerate(df['item_id'].unique())}#maps @ unique id to movies
reverse_item_map = {v: k for k, v in item_map.items()}#inverts item_map
movie_titles = dict(zip(movies['item_id'], movies['title']))#maps movie ids to titles
release_dates = dict(zip(movies['item_id'], movies['release_date']))#maps movie ids to release dates

df['user_idx'] = df['user_id'].map(user_map)#maps user ids to indices
df['item_idx'] = df['item_id'].map(item_map)#maps movie ids to indices

num_users = len(user_map)#number of users
num_items = len(item_map)#number of movies

# 🧱 Step 4: Define PyTorch Dataset
class MovieLensDataset(Dataset):
    def __init__(self, df):
        self.users = torch.tensor(df['user_idx'].values, dtype=torch.long)#converts user indices to tensors
        self.items = torch.tensor(df['item_idx'].values, dtype=torch.long)
        self.ratings = torch.tensor(df['rating'].values, dtype=torch.float32)

    def __len__(self):#returns the length of the dataset
        return len(self.ratings)#returns the number of ratings

    def __getitem__(self, idx):#returns the item at the given index
        return self.users[idx], self.items[idx], self.ratings[idx]#returns user, item, and rating

dataset = MovieLensDataset(df)
loader = DataLoader(dataset, batch_size=256, shuffle=True)

# 🧠 Step 5: Define Matrix Factorization Model
class RecommenderNet(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=50):
        super().__init__()
        self.user_embed = nn.Embedding(num_users, embedding_dim)
        self.item_embed = nn.Embedding(num_items, embedding_dim)
        self.dropout = nn.Dropout(0.2)

    def forward(self, user, item):
        user_vec = self.dropout(self.user_embed(user))
        item_vec = self.dropout(self.item_embed(item))
        return (user_vec * item_vec).sum(dim=1)

model = RecommenderNet(num_users, num_items)
optimizer = torch.optim.Adam(model.parameters(), lr=0.005)
loss_fn = nn.MSELoss()

# 🔁 Step 6: Train the model
print("Training model...")
for epoch in range(10):
    total_loss = 0
    for user, item, rating in loader:
        pred = model(user, item)
        loss = loss_fn(pred, rating)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1} | Loss: {total_loss:.4f}")

# 🎯 Step 7: Recommend top-N movies for a user (with release date)
def recommend_movies(model, user_id, top_n=5, export=False):
    user_idx = user_map[user_id]
    item_indices = torch.arange(num_items)
    user_tensor = torch.tensor([user_idx] * num_items)

    scores = model(user_tensor, item_indices).detach().numpy()

    rated_items = df[df['user_id'] == user_id]['item_idx'].tolist()
    unrated_mask = np.ones(num_items, dtype=bool)
    unrated_mask[rated_items] = False
    scores_filtered = scores[unrated_mask]
    item_indices_filtered = np.arange(num_items)[unrated_mask]

    top_indices = scores_filtered.argsort()[-top_n:][::-1]
    top_item_idxs = item_indices_filtered[top_indices]

    print(f"\nTop {top_n} recommendations for User {user_id}:")
    recommendations = []
    for idx in top_item_idxs:
        movie_id = reverse_item_map[idx]
        title = movie_titles.get(movie_id, "Title not found")
        release_date = release_dates.get(movie_id, "Unknown")
        score = scores[idx]
        print(f"  {title} (Released: {release_date}, Score: {score:.2f})")
        recommendations.append({
            'user_id': user_id,
            'movie_id': movie_id,
            'title': title,
            'release_date': release_date,
            'score': score
        })
     
    if export:
        rec_df = pd.DataFrame(recommendations)
        rec_df.to_csv(f"user_{user_id}_recommendations.csv", index=False)
        print(f"Recommendations exported to user_{user_id}_recommendations.csv")

# 🔍 Example usage
recommend_movies(model, user_id=1, top_n=5, export=True)
recommend_movies(model, user_id=10, top_n=5)
recommend_movies(model, user_id=9, top_n=5)