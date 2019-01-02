// rollup.config.js
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss';
const { uglify } = require('rollup-plugin-uglify')

const config = {
  input: 'src/lib/ZippingUploader.js',
  external: ['react', 'react-dropzone', 'antd', 'react-overlay-loading/lib/OverlayLoader',
    'react-icons/lib/fa/trash-o', 'superagent', 'deni-react-treeview', 'antd/dist/antd.css'],
  output: {
    format: 'umd',
    name: 'zipping-uploader',
    globals: {
      react: "React"
    }
  },
  plugins: [
    postcss({
      extensions: ['.css'],
    }),
    babel({
      exclude: "node_modules/**"
    }),
    uglify()
  ],
}
export default config