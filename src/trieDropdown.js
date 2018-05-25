import React, { Component } from 'react';
import peopleData from './mockData.json';
import { Dropdown } from 'semantic-ui-react';

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

class Suggester {

  constructor() {

    this.trie = {};
    this.indexedList = {};

  }

  tokenize(input) {
    // eg, Lucky Dog => 'lucky', 'dog'
    return input.toLowerCase().split(' ');
  }

  add(items) {
    const listOfItems = Array.isArray(items) ? items : [items];
    listOfItems.forEach((item) => {
      this.addItem(item);
    });
    console.log(this.trie);
  }

  addItem(item) {
   this.indexedList[item.id] = item;

   const tokens = this.tokenize(item.first_name);

   this.indexTokens(tokens, item.id);
  }

  indexTokens(tokens, itemId) {
    tokens.forEach(token => this.indexToken(token, itemId));
  }

  indexToken(token, itemId) {
    const node = this.getNode(token, true);

    node.id.push(itemId);
  }

  getId(node) {
    if (node.id.length !== 0) {
      return node.id;
    } else {
      const childrenNodeKeys = Object.keys(node).filter(key => key !== "id" );
      return flatten(childrenNodeKeys.map( child => this.getId(node[child])));
    }
  }

  getItem (id) {
    return this.indexedList[id];
  }

  search(input) {
    const tokens = this.tokenize(input);

    const nodes = tokens.map(token => this.getNode(token));
    const itemIds = flatten(nodes.map(node => this.getId(node)));
    return itemIds.map(id => this.getItem(id));
  }

  topNSearch (input, n) {
    const items = this.search(input);
    return items.slice(0, n);
  }

  topNWeightedSearch (input, n) {
    const items = this.search(input);
    //looks through all nodes' weights and returns top n weighted result
  }

  /**
   * Get the node that corresponds to a token
   *
   * @param token the token to search
   * @param create if true, creates the interim nodes if they do not already
   * exist -- guarantees that the returned node is a fully constructed node
   *
   * @returns node or null if the the node does not exist and create is false
   */
  getNode(token, create = false, node = this.trie) {
    const chars = token.split(''); // joe => ['j', 'o', 'e']
    const first = chars.shift(); // first = j, chars = ['o', 'e']

    if (create && !node[first]) {
      node[first] = {
        id: [],
        //weight: integer value
      };
    }

    if (!node[first]) {
      return null;
    }

    return chars.length === 0 ? node[first] : this.getNode(chars.join(''), create, node[first]);
  }
}

////small example//////
const suggester = new Suggester();
suggester.add(peopleData);
console.log(suggester.topNSearch("S", 5));

const DropdownItem = (props) => {
  return <Dropdown.Item
    text={props.text}
    onClick={() => props.onOptionSelect(props.id)}
  />
};

class TrieDropdown extends Component {
  constructor() {
    super();

    this.state = {
      selectedItem: null
    };
     this.handleChange = this.handleChange.bind(this);
  }

  handleChange(id) {
    this.setState({ selectedItem: id });
  };

  render() {
    const divMargin = {
      margin: '40px'
    };

    return (
      <Dropdown style={divMargin} fluid placeholder='Select' search>
        <Dropdown.Menu>
          {
            peopleData.map((person) => {
                return <DropdownItem
                  key={person.id}
                  id={person.id}
                  text={person.first_name + " " + person.last_name}
                  onOptionSelect={this.handleChange}
                />
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
