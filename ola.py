from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
tokens = tokenizer(["test", "another"], padding=True, truncation=True, return_tensors="pt")
print(tokens)
