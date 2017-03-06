const StarsFrame = React.createClass({
    render: function () {
        let numberOfStars = this.props.numberOfStarsBind;
        let stars = [];
        for (let i = 0; i < numberOfStars; i++) {
            stars.push(
                <span className="glyphicon glyphicon-star"></span>
            )
        }
        return (
            <div id="stars-frame">
                <div className="well">
                    {stars}
                </div>
            </div>
        )
    }
})

const ButtonFrame = React.createClass({
    render: function () {
        let disabled, button, correct = this.props.correctBind;

        switch (correct) {
            case true:
                button = (<button className="btn btn-lg btn-success"
                            onClick={this.props.acceptAnswerBind}>
                    <span className="glyphicon glyphicon-ok"></span>
                </button>);
                break;
            case false:
                button = (<button className="btn btn-lg btn-danger">
                    <span className="glyphicon glyphicon-remove"></span>
                </button>);
                break;
            default:
                disabled = (this.props.selectedNumbersBind.length === 0);
                button = (<button className="btn btn-lg btn-primary" disabled={disabled}
                                  onClick={this.props.checkAnswerBind}>=</button>);
        }

        return (
            <div id="button-frame">
                {button}
                <br/><br/>
                <button className="btn btn-warning btn-xs" onClick={this.props.refreshBind}
                        disabled={this.props.redrawsBind === 0}>
                    <span className="glyphicon glyphicon-refresh"></span>
                    &nbsp;
                    {this.props.redrawsBind}
                </button>
            </div>
        )
    }
})

const AnswerFrame = React.createClass({
    render: function () {
        let props = this.props;
        let selectedNumbers = props.selectedNumbersBind.map((i) => {
            return (
                <span onClick={props.unselectNumbersBind.bind(null, i)}>
                    {i}
                </span>
            )
        });
        return (
            <div id="answer-frame">
                <div className="well">
                    {selectedNumbers}
                </div>
            </div>
        )
    }
})

const NumbersFrame = React.createClass({
    render: function () {
        let numbers = [],
            className,
            selectedNumber = this.props.selectedNumberBind,
            usedNumbers = this.props.usedNumbersBind,
            selectedNumbers = this.props.selectedNumbersBind;
        for (let i = 0; i < 9; i++) {
            className = "number selected-" + (selectedNumbers.indexOf(i + 1) >= 0);
            className += " used-" + (usedNumbers.indexOf(i + 1) >= 0);
            numbers.push(<div className={className} onClick={selectedNumber.bind(null, i + 1)}>{i + 1}</div>)
        }
        return (
            <div id="numbers-frame">
                <div className="well">
                    {numbers}
                </div>
            </div>
        )
    }
})

const DoneFrame = React.createClass({
   render: function () {
       return (
           <div className="well text-center">
               <h2>{this.props.doneStatusBind}</h2>
               <button className="btn btn-default" onClick={this.props.resetGameBind}>Play Again</button>
           </div>
       )
   } 
});

const Game = React.createClass({
    getInitialState: function () {
        return {
            numberOfStars: this.randomNumber(),
            selectedNumbers: [],
            correct: null,
            redraws: 5,
            usedNumbers: [],
            doneStatus: null
        };
    },
    randomNumber: function () {
        return Math.floor(Math.random() * 9) + 1
    },
    selectNumber: function (clicked) {
        if (this.state.selectedNumbers.indexOf(clicked) < 0) {
            this.setState(
                {
                    selectedNumbers: this.state.selectedNumbers.concat(clicked),
                    correct: null
                }
            )
        }
    },
    unselectNumber: function (clicked) {
        let selectedNumbers = this.state.selectedNumbers,
            indexOfNumber = selectedNumbers.indexOf(clicked);

        selectedNumbers.splice(indexOfNumber, 1);

        this.setState({
            selectedNumbers: selectedNumbers,
            correct: null
        })
    },
    sumOfSelectedNumbers: function () {
        return this.state.selectedNumbers.reduce(function (p, n) {
            return p + n;
        }, 0)
    },
    checkAnswer: function () {
        let correct = (this.state.numberOfStars === this.sumOfSelectedNumbers())
        this.setState({correct: correct})
    },
    acceptAnswer: function () {
          let usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
          this.setState({
              selectedNumbers: [],
              usedNumbers: usedNumbers,
              correct: null,
              numberOfStars: this.randomNumber()
          }, function () {
              this.updateDoneStatus()
          })

    },
    refresh: function () {
        if(this.state.redraws > 0) {
            this.setState({
                numberOfStars: this.randomNumber(),
                correct: null,
                selectedNumbers: [],
                redraws: this.state.redraws - 1
            }, function () {
                this.updateDoneStatus()
            })
        }
    },
    possibleSolutions: function () {
        let numberOfStars = this.state.numberOfStars,
            possibleNumbers = [],
            usedNumbers = this.state.usedNumbers

        for(let i = 0; i <9; i++) {
            if(usedNumbers.indexOf(i+1) < 0) {
                possibleNumbers.push(i+1)
            }
        }

        return possibleCombinationSum(possibleNumbers, numberOfStars)
    },
    updateDoneStatus: function () {
        if(this.state.usedNumbers.length === 9) {
            this.setState({ doneStatus: 'Done. You won!' });
            return
        }
        if(this.state.redraws === 0 && !this.possibleSolutions()) {
            this.setState({ doneStatus: 'Game Ovr!'});
        }
    },
    resetGame: function () {
        this.replaceState(this.getInitialState());
    },
    render: function () {
        let selectedNumbers = this.state.selectedNumbers,
            numberOfStars = this.state.numberOfStars,
            usedNumbers = this.state.usedNumbers,
            redraws = this.state.redraws,
            correct = this.state.correct,
            doneStatus = this.state.doneStatus,
            bottomFrame;

        if (doneStatus) {
            bottomFrame = <DoneFrame doneStatusBind={doneStatus} resetGameBind={this.resetGame}/>
        } else {
            bottomFrame = <NumbersFrame selectedNumbersBind={selectedNumbers}
                                        usedNumbersBind={usedNumbers}
                                        selectedNumberBind={this.selectNumber}/>
        }
        return (
            <div id="game">
                <h2>Play Nine</h2>
                <div className="clearfix">
                    <StarsFrame numberOfStarsBind={numberOfStars}/>
                    <ButtonFrame selectedNumbersBind={selectedNumbers}
                                 correctBind={correct}
                                 checkAnswerBind={this.checkAnswer}
                                 acceptAnswerBind={this.acceptAnswer}
                                 refreshBind={this.refresh}
                                 redrawsBind={redraws} />
                    <AnswerFrame selectedNumbersBind={selectedNumbers}
                                 unselectNumbersBind={this.unselectNumber}/>
                </div>
                {bottomFrame}

            </div>
        )
    }
})

const possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
        var combinationSum = 0;
        for (var j=0 ; j < listSize ; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
};

React.render(
    <Game />,
    document.getElementById('container')
)