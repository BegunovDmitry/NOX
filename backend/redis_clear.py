import redis as redis_lib

def gogo():
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    keys = redis.keys("*")
    sum = 0
    for key in keys:
        print(redis.get(key))
        value = redis.delete(key)
        sum += value

    redis.close()
    print(f"Done!\n{sum} - elements deleted.")

gogo()
