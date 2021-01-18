/**
 * Copyright (c) 2021 Amit Kumar Swami <aks.swami@live.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

const util = require("util");
const md5File = require("md5-file");

module.exports = function (RED) {
  "use strict";

  function MD5FileNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    console.log
    node.name = config.name;
    node.filepath = config.filepath;
    node.hashField = config.hashField;

    node.on("input", function (msg) {
        if (node.filepath === undefined) {
            node.filepath = msg.filepath;
        }
        if (node.hashField === undefined) {
            node.hashField = msg.hashField;
        }
        
      md5File(node.filepath)
        .then((hash) => {
          RED.util.setMessageProperty(msg, node.hashField, hash);
          node.status({
            fill: "green",
            shape: "dot",
            text: node.filepath + " : " + hash,
          });
          node.send(msg);
        })
        .catch((error) => {
          node.status({ fill: "red", shape: "dot", text: error.message });
        });
    });
  }

  RED.nodes.registerType("md5.file", MD5FileNode);
};
