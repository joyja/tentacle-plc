<template><h1 id="directory-structure" tabindex="-1"><a class="header-anchor" href="#directory-structure" aria-hidden="true">#</a> Directory Structure</h1>
<p>Tentacle PLC looks for resources in specific folders within the current working directory.</p>
<h2 id="the-runtime-directory" tabindex="-1"><a class="header-anchor" href="#the-runtime-directory" aria-hidden="true">#</a> The runtime directory</h2>
<p>This is the folder that holds all user configuration and programs. Here is an example of the basic structure:</p>
<p><img src="https://res.cloudinary.com/jarautomation/image/upload/v1646032003/Tentacle PLC Docs/tentacle-plc-directory-structure.png" alt="Tentacle PLC Directory Structure"></p>
<p>This folder should include the following:</p>
<h3 id="the-config-json-file" tabindex="-1"><a class="header-anchor" href="#the-config-json-file" aria-hidden="true">#</a> The config.json file</h3>
<p>The <code>config.json</code> file stores the configuration for Tentacle PLC, including tasks, mqtt, and modbus. It's in json format and here is an example with the most commonly used settings:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"tasks"</span> <span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"main"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"The main task"</span><span class="token punctuation">,</span>
      <span class="token property">"scanRate"</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
      <span class="token property">"program"</span><span class="token operator">:</span> <span class="token string">"main"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"secondary"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"A less important task"</span><span class="token punctuation">,</span>
      <span class="token property">"scanRate"</span><span class="token operator">:</span> <span class="token number">2000</span><span class="token punctuation">,</span>
      <span class="token property">"program"</span><span class="token operator">:</span> <span class="token string">"secondary"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"mqtt"</span> <span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"mosquitto1"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"JAR Automation Cluster MQTT"</span><span class="token punctuation">,</span>
      <span class="token property">"rate"</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
      <span class="token property">"config"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"serverUrl"</span><span class="token operator">:</span> <span class="token string">"tcp://192.168.1.1:1883"</span><span class="token punctuation">,</span>
        <span class="token property">"groupId"</span><span class="token operator">:</span> <span class="token string">"Group1"</span><span class="token punctuation">,</span>
        <span class="token property">"username"</span><span class="token operator">:</span> <span class="token string">"user"</span><span class="token punctuation">,</span>
        <span class="token property">"password"</span><span class="token operator">:</span> <span class="token string">"password"</span><span class="token punctuation">,</span>
        <span class="token property">"edgeNode"</span><span class="token operator">:</span> <span class="token string">"Edge1"</span><span class="token punctuation">,</span>
        <span class="token property">"deviceName"</span><span class="token operator">:</span> <span class="token string">"Tentacle1"</span><span class="token punctuation">,</span>
        <span class="token property">"clientId"</span><span class="token operator">:</span> <span class="token string">"Edge1"</span><span class="token punctuation">,</span>
        <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"spBv1.0"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"modbus"</span> <span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"ModbusDevice1"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Modbus Device"</span><span class="token punctuation">,</span>
      <span class="token property">"config"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"host"</span><span class="token operator">:</span> <span class="token string">"192.168.1.2"</span><span class="token punctuation">,</span>
        <span class="token property">"port"</span><span class="token operator">:</span> <span class="token number">502</span><span class="token punctuation">,</span>
        <span class="token property">"unitId"</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
        <span class="token property">"reverseBits"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        <span class="token property">"reverseWords"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        <span class="token property">"zeroBased"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        <span class="token property">"retryRate"</span><span class="token operator">:</span> <span class="token number">5000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br></div></div><h3 id="the-variables-json-file" tabindex="-1"><a class="header-anchor" href="#the-variables-json-file" aria-hidden="true">#</a> The variables.json file</h3>
<p>The <code>variables.json</code> stores the configuration of all variables that will be store in the <code>global</code> object that is passed to all user programs and classes. TentaclePLC creates variables according to this file. It allows for the following features to be applied to each variable:</p>
<h4 id="description" tabindex="-1"><a class="header-anchor" href="#description" aria-hidden="true">#</a> Description</h4>
<p><code>description</code> Pretty self explanatory, but this String value is used to give the variable a little extra context for humans.</p>
<h4 id="initial-value" tabindex="-1"><a class="header-anchor" href="#initial-value" aria-hidden="true">#</a> Initial Value</h4>
<p><code>initialValue</code> This sets the initial value of the variable on creation or on restart if the variable is persistent.</p>
<h4 id="persistence" tabindex="-1"><a class="header-anchor" href="#persistence" aria-hidden="true">#</a> Persistence</h4>
<p><code>persistent</code> A Boolean value, if the variable is persistent it will retain it's value through a runtime restart (including hardware reboot).</p>
<h4 id="external-source" tabindex="-1"><a class="header-anchor" href="#external-source" aria-hidden="true">#</a> External Source</h4>
<p><code>source</code> Setting this syncs the value of the variable with an external source over a communications protocol (like Modbus). If the value of the address in the external source changes, the value of the variable will change. If the external source allows for writes and Tentacle PLC changes the value of the variable, Tentacle PLC will attempt to write the new value to the external source.</p>
<p>The structure depends on which protocol you are using but an example for Modbus TCP looks like this:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"modbus"</span><span class="token punctuation">,</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"ModbusDevice1"</span><span class="token punctuation">,</span>
  <span class="token property">"rate"</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
  <span class="token property">"params"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"register"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token property">"registerType"</span><span class="token operator">:</span> <span class="token string">"COIL"</span><span class="token punctuation">,</span>
    <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"BOOLEAN"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="npm-files-package-json-package-lock-json-node-modules" tabindex="-1"><a class="header-anchor" href="#npm-files-package-json-package-lock-json-node-modules" aria-hidden="true">#</a> NPM files (package.json, package-lock.json, &amp; node_modules)</h3>
<p>Tentacle PLC uses npm workspaces to allow you to install 3rd party node modules to use in your programs and classes. Therefore, the runtime directory needs all of the standard node files. A great way to start with this is to run <code>npm init</code> within your runtime directory, which will ask you some questions and create the appropriate files for you.</p>
<p>After that you can use <code>npm install</code> to install your favorite npm packages.</p>
</template>
