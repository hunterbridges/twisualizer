require 'json'

mentioned_me = `t mentions -n 999999 | sed 's/   //' | grep -e "^\@[A-Za-z0-9]*$" | sed 's/@//'`.split("\n")
ive_mentioned = `t timeline hunterbridges -n 999999 --long | grep -v -e "RT @.*:" | sed 's/[^0-9].*\@HunterBridges //' | grep -o '\@[A-Za-z0-9_]*' | sed 's/@//'`.split("\n")
ive_retweeted = `t retweets -n 999999 | sed 's/   //' | grep -v -e "^\@[A-Za-z0-9]*$" | grep -e "^RT .*:" | sed 's/RT @//' | sed 's/:.*//' | sed 's/@//'`.split("\n")

p_mentioned_me = Hash.new(0)
mentioned_me.each do |p|
  p_mentioned_me[p] += 1
end

p_ive_mentioned = Hash.new(0)
ive_mentioned.each do |p|
  p_ive_mentioned[p] += 1
end

p_ive_retweeted = Hash.new(0)
ive_retweeted.each do |p|
  p_ive_retweeted[p] += 1
end

leaders = `t leaders | sed 's/\s\s+/\r/'`.split("\n")
disciples = `t disciples | sed 's/\s\s+/\r/'`.split("\n")
friends = `t friends | sed 's/\s\s+/\r/'`.split("\n")

conversation_tweets = `t timeline hunterbridges --long | grep -v -e "RT @.*:" | sed 's/[^0-9].*\@HunterBridges //' | grep -e '\@[A-Za-z0-9_]*'`.split("\n")
original_tweets = `t timeline hunterbridges --long | grep -v -e "RT @.*:" | sed 's/[^0-9].*\@HunterBridges //' | grep -v -e '\@[A-Za-z0-9_]*'`.split("\n")

dump = {
  :mentioned_me => p_mentioned_me,
  :ive_mentioned => p_ive_mentioned,
  :ive_retweeted => p_ive_retweeted,
  :network => {
    :leaders => leaders,
    :disciples => disciples,
    :friends => friends
  }
}

puts dump.to_json
