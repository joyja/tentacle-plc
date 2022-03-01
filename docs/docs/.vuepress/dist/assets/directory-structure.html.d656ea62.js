import{b as s}from"./app.13de8074.js";import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";const a={},e=s(`<h1 id="directory-structure" tabindex="-1"><a class="header-anchor" href="#directory-structure" aria-hidden="true">#</a> Directory Structure</h1><p>Tentacle PLC looks for resources in specific folders within the current working directory.</p><h2 id="the-runtime-directory" tabindex="-1"><a class="header-anchor" href="#the-runtime-directory" aria-hidden="true">#</a> The runtime directory</h2><p>This is the folder that holds all user configuration and programs. Here is an example of the basic structure:</p><p><img src="https://res.cloudinary.com/jarautomation/image/upload/v1646032003/Tentacle PLC Docs/tentacle-plc-directory-structure.png" alt="Tentacle PLC Directory Structure"></p><p>This folder should include the following:</p><h3 id="the-config-json-file" tabindex="-1"><a class="header-anchor" href="#the-config-json-file" aria-hidden="true">#</a> The config.json file</h3><p>The <code>config.json</code> file stores the configuration for Tentacle PLC, including tasks, mqtt, and modbus. It&#39;s in json format and here is an example with the most commonly used settings:</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;tasks&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;main&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;The main task&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;scanRate&quot;</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
      <span class="token property">&quot;program&quot;</span><span class="token operator">:</span> <span class="token string">&quot;main&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;secondary&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A less important task&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;scanRate&quot;</span><span class="token operator">:</span> <span class="token number">2000</span><span class="token punctuation">,</span>
      <span class="token property">&quot;program&quot;</span><span class="token operator">:</span> <span class="token string">&quot;secondary&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;mqtt&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;mosquitto1&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;JAR Automation Cluster MQTT&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;rate&quot;</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
      <span class="token property">&quot;config&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;serverUrl&quot;</span><span class="token operator">:</span> <span class="token string">&quot;tcp://192.168.1.1:1883&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;groupId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Group1&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;user&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;password&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;edgeNode&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Edge1&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;deviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Tentacle1&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;clientId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Edge1&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;spBv1.0&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;modbus&quot;</span> <span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;ModbusDevice1&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Modbus Device&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;config&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;host&quot;</span><span class="token operator">:</span> <span class="token string">&quot;192.168.1.2&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;port&quot;</span><span class="token operator">:</span> <span class="token number">502</span><span class="token punctuation">,</span>
        <span class="token property">&quot;unitId&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
        <span class="token property">&quot;reverseBits&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        <span class="token property">&quot;reverseWords&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        <span class="token property">&quot;zeroBased&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        <span class="token property">&quot;retryRate&quot;</span><span class="token operator">:</span> <span class="token number">5000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br></div></div><h3 id="the-variables-json-file" tabindex="-1"><a class="header-anchor" href="#the-variables-json-file" aria-hidden="true">#</a> The variables.json file</h3><p>The <code>variables.json</code> stores the configuration of all variables that will be store in the <code>global</code> object that is passed to all user programs and classes. TentaclePLC creates variables according to this file. It allows for the following features to be applied to each variable:</p><h4 id="description" tabindex="-1"><a class="header-anchor" href="#description" aria-hidden="true">#</a> Description</h4><p><code>description</code> Pretty self explanatory, but this String value is used to give the variable a little extra context for humans.</p><h4 id="initial-value" tabindex="-1"><a class="header-anchor" href="#initial-value" aria-hidden="true">#</a> Initial Value</h4><p><code>initialValue</code> This sets the initial value of the variable on creation or on restart if the variable is persistent.</p><h4 id="persistence" tabindex="-1"><a class="header-anchor" href="#persistence" aria-hidden="true">#</a> Persistence</h4><p><code>persistent</code> A Boolean value, if the variable is persistent it will retain it&#39;s value through a runtime restart (including hardware reboot).</p><h4 id="external-source" tabindex="-1"><a class="header-anchor" href="#external-source" aria-hidden="true">#</a> External Source</h4><p><code>source</code> Setting this syncs the value of the variable with an external source over a communications protocol (like Modbus). If the value of the address in the external source changes, the value of the variable will change. If the external source allows for writes and Tentacle PLC changes the value of the variable, Tentacle PLC will attempt to write the new value to the external source.</p><p>The structure depends on which protocol you are using but an example for Modbus TCP looks like this:</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;modbus&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;ModbusDevice1&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;rate&quot;</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
  <span class="token property">&quot;params&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;register&quot;</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token property">&quot;registerType&quot;</span><span class="token operator">:</span> <span class="token string">&quot;COIL&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;format&quot;</span><span class="token operator">:</span> <span class="token string">&quot;BOOLEAN&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="npm-files-package-json-package-lock-json-node-modules" tabindex="-1"><a class="header-anchor" href="#npm-files-package-json-package-lock-json-node-modules" aria-hidden="true">#</a> NPM files (package.json, package-lock.json, &amp; node_modules)</h3><p>Tentacle PLC uses npm workspaces to allow you to install 3rd party node modules to use in your programs and classes. Therefore, the runtime directory needs all of the standard node files. A great way to start with this is to run <code>npm init</code> within your runtime directory, which will ask you some questions and create the appropriate files for you.</p><p>After that you can use <code>npm install</code> to install your favorite npm packages.</p>`,24);function t(o,p){return e}var c=n(a,[["render",t]]);export{c as default};