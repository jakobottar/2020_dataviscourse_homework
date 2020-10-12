/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        // Create array of nodes
        this.treeNodes = [];

        // Loop over the json data, adding nodes and assigning parents
        for(let i = 0; i < json.length ; i++){
            // allocate new node
            let newNode = new Node(json[i].name, json[i].parent);
            // find it's parent and update that attribute
            newNode.parentNode = this.treeNodes.find(n => n.name == newNode.parentName);

            // add the node to the tree
            this.treeNodes.push(newNode);
        }

        // Assign the root of the tree
        this.root = this.treeNodes[0];
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // loop through the tree, assigning children
        for(let i = 0; i < this.treeNodes.length ; i++){
            let currNode = this.treeNodes[i];
            if(typeof currNode.parentNode !== 'undefined'){
                currNode.parentNode.children.push(currNode);
            }
        }
        // start at root and assign level and position
        this.assignLevel(this.root, 0);
        this.assignPosition(this.root, 0);
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        // assign the level
        node.level = level;
        // run assignLevel on each child, incrementing level as we go
        if(node.children.length > 0){
            node.children.forEach(e => {
                this.assignLevel(e, level+1);
            });
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {        
        // assign the position
        node.position = position;

        // if the node is a "leaf" (on the end of a tree branch) end the recursion and let the above
        // function know to add 1 to the position 
        if(node.children.length == 0){
            return 1;
        }
        
        // start the branch offset at 0
        let offset = 0;
        // recurse down the tree, adding 1 for every leaf node. 
        // without multiple inheritance, this is the only reason we will need to increment position
        node.children.forEach(n => {
            // child nodes get assigned the passed-in position plus the offset
            offset += this.assignPosition(n, position+offset);
        });

        // return the offset to the above function
        return offset;
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        // add svg element
        let svg = d3.select("body")
            .append("svg")
            .attr("width", 1200)
            .attr("height", 1200);

        // constants
        const OFFSET = 50;
        const XMULT = 110;
        const YMULT = 90;
        const RAD = 40;

        // add lines first, draw them from the node to it's parent (unless it's the root)
        svg.selectAll("line")
            .data(this.treeNodes)
            .enter()
            .append("line")
            .attr("x1", d => {
                if(typeof d.parentNode !== 'undefined'){
                    return(OFFSET + d.parentNode.level*XMULT)
                }
            })
            .attr("x2", d => {
                if(typeof d.parentNode !== 'undefined'){
                    return(OFFSET + d.level*XMULT)
                }
            })
            .attr("y1", d => {
                if(typeof d.parentNode !== 'undefined'){
                    return(OFFSET + d.parentNode.position*YMULT)
                }
            })
            .attr("y2", d => {
                if(typeof d.parentNode !== 'undefined'){
                    return(OFFSET + d.position*YMULT)
                }
            });
        
        // add group elements and define the transformation
        let nodes = svg.selectAll("g")
            .data(this.treeNodes)
            .enter()
            .append("g")
            .attr("class", "nodeGroup")
            .attr("transform", d => "translate(" + (OFFSET + d.level*XMULT) + ", " + (OFFSET + d.position*YMULT) + ")" );
            
        // add circles
        nodes.append("circle")
            .attr("r", RAD);
        
        // add text
        nodes.append("text")
            .attr("class", "label")
            .text(d => d.name);
            
    }

}