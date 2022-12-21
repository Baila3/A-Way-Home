import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';


import './PathfindingVisualizer.css';

let startNodeY = 0;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 49;


export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNodeY: 0,
      startNodeX:0,
    }
    this.handleChange = this.handleChange.bind(this);
    createNode = createNode.bind(this);
    this.visualizeDijkstra = this.visualizeDijkstra.bind(this)
  }


  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 5 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 20 * i);
    }
  }
  handleChange() {
    let inputX = (document.getElementById("myInputX").value);
    let inputY = (document.getElementById("myInputY").value);
    if ( isNaN(inputX) === true || inputX > 49 || inputX < 0) {
      return inputX = 0;
    }
    if ( isNaN(inputY) === true || inputY > 19 || inputY < 0) {
      return inputY = 0;
    }
    const {grid} = this.state
    this.setState({startNodeY: Number(inputY), startNodeX: Number(inputX)}, () =>
      grid[this.state.startNodeY][this.state.startNodeX].isStart = true &&
      this.setState({grid: getInitialGrid()})
    )
  }

  

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[this.state.startNodeY][this.state.startNodeX];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
   reset() {
    window.location.reload(false);
  }
  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.reset()}>
          Reset
        </button>
        <form>
          <label>
            X:
            <input id="myInputX" type="text" onChange={this.handleChange}/>
          </label>
        </form>
        <form>
          <label>
            Y:
            <input id="myInputY" type="text" onChange={this.handleChange}/>
          </label>
        </form>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}>
                      </Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};


function createNode(col, row) {
  return {
    col,
    row,
    isStart: row === this.state.startNodeY && col === this.state.startNodeX,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};






const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
