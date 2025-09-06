<a href="./../README.md">back README</a>

# 名前付きexport vs デフォルトexport 比較表

<table>
  <thead>
    <tr>
      <th>項目</th>
      <th>名前付きexport</th>
      <th>デフォルトexport</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>書き方（export）</strong></td>
      <td>
        <code>export const add = () => {}</code><br>
        <code>export { add }</code>
      </td>
      <td>
        <code>export default multiply</code>
      </td>
    </tr>
    <tr>
      <td><strong>書き方（import）</strong></td>
      <td>
        <code>import { add } from './math'</code><br>
        <code>import { add, sub } from './math'</code>
      </td>
      <td>
        <code>import multiply from './math'</code>
      </td>
    </tr>
    <tr>
      <td><strong>数量</strong></td>
      <td>複数可能</td>
      <td>1つのファイルに1つだけ</td>
    </tr>
    <tr>
      <td><strong>名前</strong></td>
      <td>元の名前を使用</td>
      <td>インポート時に自由に命名</td>
    </tr>
    <tr>
      <td><strong>用途</strong></td>
      <td>
        部品・ユーティリティ関数<br>
        複数の機能
      </td>
      <td>
        メインのコンポーネント・関数<br>
        ファイルの主要機能
      </td>
    </tr>
  </tbody>
</table>

## コード例

**math.js**
```javascript
// 名前付きexport
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// デフォルトexport
const multiply = (a, b) => a * b
export default multiply
```

**main.js**
```javascript
// 名前付きimport
import { add, subtract } from './math'

// デフォルトimport
import multiply from './math'
// または任意の名前で
import calc from './math'
```