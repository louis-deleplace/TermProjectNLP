import copy
import numpy as np 

def discountedCumulativeGain(result):
    dcg = []
    for idx, val in enumerate(result): 
        numerator = 2**val - 1
        # add 2 because python 0-index
        denominator =  np.log2(idx + 2) 
        score = numerator/denominator
        dcg.append(score)
    return sum(dcg)

def normalizedDiscountedCumulativeGain(result, sorted_result): 
    dcg = discountedCumulativeGain(result)
    idcg = discountedCumulativeGain(sorted_result)
    ndcg = dcg / idcg
    return ndcg


ranking = [4, 3, 2, 3, 1, 2, 0, 0, 2, 3, 3, 0, 0, 3, 2, 3, 1, 1, 1, 3, 0, 0, 3, 3, 1, 2, 0, 3, 3, 1, 0, 0, 3, 3, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
goodRanking = copy.deepcopy(ranking)
goodRanking.sort(reverse=True)

print(f"NDCG setA: {normalizedDiscountedCumulativeGain(ranking, goodRanking)}\nNDCG setB: {normalizedDiscountedCumulativeGain(goodRanking, goodRanking)}")