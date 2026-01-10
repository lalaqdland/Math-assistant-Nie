/**
 * 知识点数据模块 - 考研数学学习助手
 * 包含微积分、线性代数、概率论三大模块的核心知识点
 *
 * 数据结构:
 * - 学科 (subject) -> 章节 (chapter) -> 知识点 (unit)
 * - 每个知识点包含: 概念、公式、例题、学习要点
 */

/**
 * 获取默认知识点树
 * @returns {Object} 知识点树结构
 */
function getDefaultKnowledgeTree() {
    return {
        // ==================== 微积分 ====================
        calculus: {
            id: 'calculus',
            name: '微积分',
            icon: '📐',
            progress: 0,
            expanded: true,
            chapters: [
                // 第一章 函数与极限
                {
                    id: 'calc-ch1',
                    name: '第一章 函数与极限',
                    expanded: false,
                    units: [
                        {
                            id: 'calc-1-1',
                            name: '函数的概念',
                            difficulty: 'basic',
                            content: {
                                concept: `函数是数学中最基本的概念之一。设 $X$ 和 $Y$ 是两个非空数集，如果按照某种对应法则 $f$，对于集合 $X$ 中的每一个元素 $x$，在集合 $Y$ 中都有唯一确定的元素 $y$ 与之对应，则称 $f$ 为从 $X$ 到 $Y$ 的函数，记作 $y = f(x)$。

其中：
- $x$ 称为自变量
- $y$ 称为因变量
- $X$ 称为定义域，记作 $D_f$
- $Y$ 称为值域，记作 $R_f$

**函数的三要素**：定义域、值域、对应法则，三者缺一不可。`,
                                formulas: [
                                    '$y = f(x), \\quad x \\in D$',
                                    '$D_f = \\{x \\mid f(x) \\text{有意义}\\}$',
                                    '$R_f = \\{y \\mid y = f(x), x \\in D_f\\}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求函数定义域',
                                        content: '求函数 $f(x) = \\dfrac{1}{\\sqrt{x-1}}$ 的定义域。',
                                        solution: `**解：** 要使函数有意义，需要满足：
1. $x - 1 > 0$（根号下必须为正数）
2. $\\sqrt{x-1} \\neq 0$（分母不能为0）

从条件1得：$x > 1$

因此，函数的定义域为 $(1, +\\infty)$。`
                                    },
                                    {
                                        title: '例2：复合函数定义域',
                                        content: '已知 $f(x)$ 的定义域为 $[0, 1]$，求 $f(x^2)$ 的定义域。',
                                        solution: `**解：** 由 $f(x)$ 的定义域为 $[0, 1]$ 知，要使 $f(x^2)$ 有意义，需要：
$$0 \\leq x^2 \\leq 1$$
解得：$-1 \\leq x \\leq 1$

因此，$f(x^2)$ 的定义域为 $[-1, 1]$。`
                                    }
                                ],
                                keyPoints: [
                                    '函数的三要素：定义域、值域、对应法则',
                                    '定义域是自变量的取值范围，需考虑分母不为0、根号下非负等条件',
                                    '两个函数相等当且仅当定义域和对应法则都相同',
                                    '复合函数的定义域要从内到外逐层考虑'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-1-2',
                            name: '函数的性质',
                            difficulty: 'basic',
                            content: {
                                concept: `函数的主要性质包括：单调性、奇偶性、周期性和有界性。

**1. 单调性**
- 单调递增：$x_1 < x_2 \\Rightarrow f(x_1) \\leq f(x_2)$
- 严格单调递增：$x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$

**2. 奇偶性**
- 偶函数：$f(-x) = f(x)$，图像关于 $y$ 轴对称
- 奇函数：$f(-x) = -f(x)$，图像关于原点对称

**3. 周期性**
若存在 $T > 0$ 使得 $f(x+T) = f(x)$ 对所有 $x$ 成立，则 $f(x)$ 是周期函数。

**4. 有界性**
若存在 $M > 0$ 使得 $|f(x)| \\leq M$ 对所有 $x \\in D$ 成立，则 $f(x)$ 在 $D$ 上有界。`,
                                formulas: [
                                    '$f(-x) = f(x)$ （偶函数）',
                                    '$f(-x) = -f(x)$ （奇函数）',
                                    '$f(x+T) = f(x)$ （周期函数）',
                                    '$|f(x)| \\leq M$ （有界性）'
                                ],
                                examples: [
                                    {
                                        title: '例1：判断函数奇偶性',
                                        content: '判断函数 $f(x) = x^3 + x$ 的奇偶性。',
                                        solution: `**解：** 定义域：$D = (-\\infty, +\\infty)$，关于原点对称。

计算 $f(-x)$：
$$f(-x) = (-x)^3 + (-x) = -x^3 - x = -(x^3 + x) = -f(x)$$

因此，$f(x) = x^3 + x$ 是**奇函数**。`
                                    }
                                ],
                                keyPoints: [
                                    '判断奇偶性前先检查定义域是否关于原点对称',
                                    '奇函数×奇函数=偶函数，偶函数×偶函数=偶函数',
                                    '可导的偶函数的导数是奇函数',
                                    '奇函数若在 $x=0$ 处有定义，则 $f(0)=0$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-1-3',
                            name: '极限的概念',
                            difficulty: 'intermediate',
                            content: {
                                concept: `极限是微积分的基础概念。

**数列极限（$\\varepsilon-N$定义）**：
设 $\\{a_n\\}$ 为一数列，如果存在常数 $A$，对于任意给定的 $\\varepsilon > 0$，总存在正整数 $N$，使得当 $n > N$ 时，恒有 $|a_n - A| < \\varepsilon$，则称数列 $\\{a_n\\}$ 收敛于 $A$，记作
$$\\lim_{n \\to \\infty} a_n = A$$

**函数极限（$\\varepsilon-\\delta$定义）**：
设函数 $f(x)$ 在点 $x_0$ 的某去心邻域内有定义，如果存在常数 $A$，对于任意给定的 $\\varepsilon > 0$，总存在 $\\delta > 0$，使得当 $0 < |x - x_0| < \\delta$ 时，恒有 $|f(x) - A| < \\varepsilon$，则称 $A$ 为 $f(x)$ 当 $x \\to x_0$ 时的极限。`,
                                formulas: [
                                    '$\\lim\\limits_{n \\to \\infty} a_n = A$',
                                    '$\\lim\\limits_{x \\to x_0} f(x) = A$',
                                    '$\\lim\\limits_{x \\to x_0^+} f(x)$ （右极限）',
                                    '$\\lim\\limits_{x \\to x_0^-} f(x)$ （左极限）'
                                ],
                                examples: [
                                    {
                                        title: '例1：用定义证明极限',
                                        content: '用极限定义证明：$\\lim\\limits_{n \\to \\infty} \\dfrac{1}{n} = 0$',
                                        solution: `**证明：** 对于任意 $\\varepsilon > 0$，要使
$$\\left|\\frac{1}{n} - 0\\right| = \\frac{1}{n} < \\varepsilon$$
只需 $n > \\dfrac{1}{\\varepsilon}$

取 $N = \\left[\\dfrac{1}{\\varepsilon}\\right] + 1$，则当 $n > N$ 时，
$$\\left|\\frac{1}{n} - 0\\right| < \\varepsilon$$

因此，$\\lim\\limits_{n \\to \\infty} \\dfrac{1}{n} = 0$。`
                                    }
                                ],
                                keyPoints: [
                                    '极限描述的是函数的趋势，与函数在该点是否有定义无关',
                                    '极限存在的充要条件：左极限=右极限',
                                    '极限的四则运算法则适用于极限存在的情况',
                                    '重要极限：$\\lim\\limits_{x \\to 0} \\dfrac{\\sin x}{x} = 1$',
                                    '重要极限：$\\lim\\limits_{x \\to \\infty} \\left(1 + \\dfrac{1}{x}\\right)^x = e$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-1-4',
                            name: '极限的计算',
                            difficulty: 'intermediate',
                            content: {
                                concept: `极限计算的常用方法：

**1. 有理化**
分子或分母有理化，消去不定式。

**2. 等价无穷小替换**
当 $x \\to 0$ 时：
- $\\sin x \\sim x$
- $\\tan x \\sim x$
- $\\arcsin x \\sim x$
- $\\arctan x \\sim x$
- $1 - \\cos x \\sim \\dfrac{x^2}{2}$
- $e^x - 1 \\sim x$
- $\\ln(1+x) \\sim x$
- $(1+x)^a - 1 \\sim ax$

**3. 洛必达法则**
若 $\\lim\\limits_{x \\to a} \\dfrac{f(x)}{g(x)}$ 是 $\\dfrac{0}{0}$ 或 $\\dfrac{\\infty}{\\infty}$ 型，则
$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$
（前提是右边极限存在）

**4. 泰勒展开**
用函数的泰勒级数展开，保留主要项。`,
                                formulas: [
                                    '$\\sin x \\sim x$ （$x \\to 0$）',
                                    '$\\tan x \\sim x$ （$x \\to 0$）',
                                    '$e^x - 1 \\sim x$ （$x \\to 0$）',
                                    '$\\ln(1+x) \\sim x$ （$x \\to 0$）',
                                    '$1 - \\cos x \\sim \\dfrac{x^2}{2}$ （$x \\to 0$）'
                                ],
                                examples: [
                                    {
                                        title: '例1：等价无穷小',
                                        content: '求 $\\lim\\limits_{x \\to 0} \\dfrac{\\sin 3x}{x}$',
                                        solution: `**解：** 当 $x \\to 0$ 时，$\\sin 3x \\sim 3x$

$$\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = \\lim_{x \\to 0} \\frac{3x}{x} = 3$$`
                                    },
                                    {
                                        title: '例2：洛必达法则',
                                        content: '求 $\\lim\\limits_{x \\to 0} \\dfrac{e^x - 1 - x}{x^2}$',
                                        solution: `**解：** 这是 $\\dfrac{0}{0}$ 型，用洛必达法则：

$$\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2} = \\lim_{x \\to 0} \\frac{e^x - 1}{2x} = \\lim_{x \\to 0} \\frac{e^x}{2} = \\frac{1}{2}$$`
                                    }
                                ],
                                keyPoints: [
                                    '等价无穷小只能在乘除法中替换，加减法中一般不能用',
                                    '洛必达法则使用前要先验证是否为不定式',
                                    '洛必达法则可能需要多次使用',
                                    '复杂极限可以结合多种方法求解'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-1-5',
                            name: '连续与间断',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**函数连续的定义**：
设函数 $f(x)$ 在点 $x_0$ 的某邻域内有定义，如果
$$\\lim_{x \\to x_0} f(x) = f(x_0)$$
则称 $f(x)$ 在点 $x_0$ 连续。

**间断点的分类**：

**第一类间断点**（左右极限都存在）：
- 可去间断点：$\\lim\\limits_{x \\to x_0} f(x)$ 存在但 $\\neq f(x_0)$
- 跳跃间断点：左极限 $\\neq$ 右极限

**第二类间断点**（左右极限至少一个不存在）：
- 无穷间断点：极限为无穷
- 振荡间断点：极限振荡不存在`,
                                formulas: [
                                    '$\\lim\\limits_{x \\to x_0} f(x) = f(x_0)$ （连续定义）',
                                    '$\\lim\\limits_{x \\to x_0^-} f(x) = \\lim\\limits_{x \\to x_0^+} f(x) = f(x_0)$ （连续等价条件）'
                                ],
                                examples: [
                                    {
                                        title: '例1：判断间断点类型',
                                        content: '讨论函数 $f(x) = \\dfrac{x^2 - 1}{x - 1}$ 在 $x = 1$ 处的间断类型。',
                                        solution: `**解：** $f(x) = \\dfrac{(x-1)(x+1)}{x-1} = x + 1$（$x \\neq 1$）

$$\\lim_{x \\to 1} f(x) = \\lim_{x \\to 1} (x+1) = 2$$

但 $f(1)$ 无定义。

因此 $x = 1$ 是**可去间断点**。`
                                    }
                                ],
                                keyPoints: [
                                    '连续的三个条件：函数在该点有定义、极限存在、极限值等于函数值',
                                    '初等函数在其定义域内连续',
                                    '闭区间上连续函数的性质：有界性、最值、介值定理、零点定理'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第二章 导数与微分
                {
                    id: 'calc-ch2',
                    name: '第二章 导数与微分',
                    expanded: false,
                    units: [
                        {
                            id: 'calc-2-1',
                            name: '导数的概念',
                            difficulty: 'intermediate',
                            content: {
                                concept: `导数是函数变化率的数学描述。

**导数的定义**：
$$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x} = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}$$

**几何意义**：导数 $f'(x_0)$ 表示曲线 $y = f(x)$ 在点 $(x_0, f(x_0))$ 处切线的斜率。

**物理意义**：若 $s = s(t)$ 表示位移，则 $s'(t) = v(t)$ 表示瞬时速度。

**可导与连续的关系**：可导必连续，但连续不一定可导。`,
                                formulas: [
                                    '$f\'(x_0) = \\lim\\limits_{\\Delta x \\to 0} \\dfrac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$',
                                    '$(x^n)\' = nx^{n-1}$',
                                    '$(\\sin x)\' = \\cos x$',
                                    '$(\\cos x)\' = -\\sin x$',
                                    '$(e^x)\' = e^x$',
                                    '$(\\ln x)\' = \\dfrac{1}{x}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：用定义求导数',
                                        content: '用导数定义求 $f(x) = x^2$ 在 $x = 2$ 处的导数。',
                                        solution: `**解：**
$$f'(2) = \\lim_{\\Delta x \\to 0} \\frac{(2 + \\Delta x)^2 - 4}{\\Delta x}$$
$$= \\lim_{\\Delta x \\to 0} \\frac{4 + 4\\Delta x + (\\Delta x)^2 - 4}{\\Delta x}$$
$$= \\lim_{\\Delta x \\to 0} (4 + \\Delta x) = 4$$`
                                    }
                                ],
                                keyPoints: [
                                    '导数的本质是函数的瞬时变化率',
                                    '可导必连续，但连续不一定可导',
                                    '常见的不可导点：尖点、垂直切线、间断点',
                                    '左导数和右导数相等是函数在该点可导的充要条件'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-2-2',
                            name: '求导法则',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**基本求导法则**：
1. $(u \\pm v)' = u' \\pm v'$
2. $(uv)' = u'v + uv'$
3. $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}$

**复合函数求导（链式法则）**：
$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$

**隐函数求导**：
对方程两边同时对 $x$ 求导，注意 $y$ 是 $x$ 的函数。

**参数方程求导**：
若 $\\begin{cases} x = \\varphi(t) \\\\ y = \\psi(t) \\end{cases}$，则 $\\dfrac{dy}{dx} = \\dfrac{\\psi'(t)}{\\varphi'(t)}$`,
                                formulas: [
                                    '$(u \\pm v)\' = u\' \\pm v\'$',
                                    '$(uv)\' = u\'v + uv\'$',
                                    '$\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - uv\'}{v^2}$',
                                    '$\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$ （链式法则）'
                                ],
                                examples: [
                                    {
                                        title: '例1：复合函数求导',
                                        content: '求 $y = e^{\\sin x}$ 的导数。',
                                        solution: `**解：** 设 $u = \\sin x$，则 $y = e^u$

$$y' = (e^u)' \\cdot u' = e^u \\cdot \\cos x = e^{\\sin x} \\cos x$$`
                                    }
                                ],
                                keyPoints: [
                                    '复合函数求导要识别内外层函数',
                                    '隐函数求导时注意 $y$ 对 $x$ 的导数',
                                    '对数求导法适用于幂指函数',
                                    '参数方程求导：$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-2-3',
                            name: '微分',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**微分的定义**：
设函数 $y = f(x)$ 在点 $x_0$ 可导，则函数的增量可以表示为
$$\\Delta y = f'(x_0)\\Delta x + o(\\Delta x)$$
其中 $f'(x_0)\\Delta x$ 称为函数在点 $x_0$ 的微分，记作
$$dy = f'(x_0)dx$$

**微分的几何意义**：
微分 $dy$ 是曲线切线上的增量，$\\Delta y$ 是曲线上的增量。当 $\\Delta x$ 很小时，$dy \\approx \\Delta y$。

**微分的运算法则**：
与导数运算法则相同，只需将 $'$ 换成 $d$。`,
                                formulas: [
                                    '$dy = f\'(x)dx$',
                                    '$d(u \\pm v) = du \\pm dv$',
                                    '$d(uv) = udv + vdu$',
                                    '$d\\left(\\dfrac{u}{v}\\right) = \\dfrac{vdu - udv}{v^2}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求微分',
                                        content: '求 $y = x^3 + 2x$ 的微分。',
                                        solution: `**解：** $y' = 3x^2 + 2$

因此 $dy = (3x^2 + 2)dx$`
                                    }
                                ],
                                keyPoints: [
                                    '微分是函数增量的线性主部',
                                    '可微与可导是等价的',
                                    '微分形式的导数公式便于记忆和应用',
                                    '微分的近似计算：$f(x_0 + \\Delta x) \\approx f(x_0) + f\'(x_0)\\Delta x$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第三章 中值定理与导数应用
                {
                    id: 'calc-ch3',
                    name: '第三章 中值定理与导数应用',
                    expanded: false,
                    units: [
                        {
                            id: 'calc-3-1',
                            name: '中值定理',
                            difficulty: 'advanced',
                            content: {
                                concept: `**罗尔定理**：
若 $f(x)$ 在 $[a,b]$ 上连续，$(a,b)$ 内可导，且 $f(a) = f(b)$，则存在 $\\xi \\in (a,b)$ 使得 $f'(\\xi) = 0$。

**拉格朗日中值定理**：
若 $f(x)$ 在 $[a,b]$ 上连续，$(a,b)$ 内可导，则存在 $\\xi \\in (a,b)$ 使得
$$f(b) - f(a) = f'(\\xi)(b-a)$$

**柯西中值定理**：
若 $f(x), g(x)$ 在 $[a,b]$ 上连续，$(a,b)$ 内可导，$g'(x) \\neq 0$，则存在 $\\xi \\in (a,b)$ 使得
$$\\frac{f(b) - f(a)}{g(b) - g(a)} = \\frac{f'(\\xi)}{g'(\\xi)}$$`,
                                formulas: [
                                    '$f\'(\\xi) = 0$ （罗尔定理）',
                                    '$f(b) - f(a) = f\'(\\xi)(b-a)$ （拉格朗日）',
                                    '$\\dfrac{f(b) - f(a)}{g(b) - g(a)} = \\dfrac{f\'(\\xi)}{g\'(\\xi)}$ （柯西）'
                                ],
                                examples: [
                                    {
                                        title: '例1：证明存在性',
                                        content: '设 $f(x)$ 在 $[0,1]$ 上连续，$(0,1)$ 内可导，$f(0)=0, f(1)=1$。证明存在 $\\xi \\in (0,1)$ 使得 $f\'(\\xi) = 1$。',
                                        solution: `**证明：** 由拉格朗日中值定理，存在 $\\xi \\in (0,1)$，使得
$$f(1) - f(0) = f'(\\xi)(1-0)$$
$$1 - 0 = f'(\\xi) \\cdot 1$$
$$f'(\\xi) = 1$$`
                                    }
                                ],
                                keyPoints: [
                                    '罗尔定理是拉格朗日中值定理的特例',
                                    '拉格朗日中值定理是柯西中值定理的特例',
                                    '中值定理常用于证明等式或不等式',
                                    '注意检验定理的条件是否满足'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-3-2',
                            name: '函数的单调性与极值',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**单调性判断**：
- $f'(x) > 0$ 在区间 $I$ 上，则 $f(x)$ 在 $I$ 上单调递增
- $f'(x) < 0$ 在区间 $I$ 上，则 $f(x)$ 在 $I$ 上单调递减

**极值的必要条件**：
若 $f(x)$ 在 $x_0$ 处取得极值且可导，则 $f'(x_0) = 0$

**极值的充分条件**：
1. 第一充分条件：$f'(x)$ 在 $x_0$ 两侧变号
2. 第二充分条件：$f'(x_0) = 0$ 且 $f''(x_0) \\neq 0$
   - $f''(x_0) < 0$，极大值
   - $f''(x_0) > 0$，极小值`,
                                formulas: [
                                    '$f\'(x) > 0 \\Rightarrow f(x)$ 单调递增',
                                    '$f\'(x) < 0 \\Rightarrow f(x)$ 单调递减',
                                    '$f\'(x_0) = 0$ （极值必要条件）'
                                ],
                                examples: [
                                    {
                                        title: '例1：求函数极值',
                                        content: '求函数 $f(x) = x^3 - 3x + 2$ 的极值。',
                                        solution: `**解：** $f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$

令 $f'(x) = 0$，得 $x = \\pm 1$

- 当 $x < -1$ 时，$f'(x) > 0$
- 当 $-1 < x < 1$ 时，$f'(x) < 0$
- 当 $x > 1$ 时，$f'(x) > 0$

因此：
- $x = -1$ 是极大值点，$f(-1) = 4$
- $x = 1$ 是极小值点，$f(1) = 0$`
                                    }
                                ],
                                keyPoints: [
                                    '驻点（$f\'(x)=0$ 的点）不一定是极值点',
                                    '不可导点也可能是极值点',
                                    '第二充分条件更简便但有局限性',
                                    '闭区间上求最值要比较端点值和极值'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第四章 不定积分
                {
                    id: 'calc-ch4',
                    name: '第四章 不定积分',
                    expanded: false,
                    units: [
                        {
                            id: 'calc-4-1',
                            name: '不定积分的概念',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**原函数的定义**：
若 $F'(x) = f(x)$，则称 $F(x)$ 是 $f(x)$ 的一个原函数。

**不定积分的定义**：
函数 $f(x)$ 的所有原函数的集合称为 $f(x)$ 的不定积分，记作
$$\\int f(x)dx = F(x) + C$$
其中 $C$ 是任意常数。

**基本积分公式**：
$$\\int x^a dx = \\frac{x^{a+1}}{a+1} + C \\quad (a \\neq -1)$$
$$\\int \\frac{1}{x} dx = \\ln|x| + C$$
$$\\int e^x dx = e^x + C$$
$$\\int \\sin x dx = -\\cos x + C$$
$$\\int \\cos x dx = \\sin x + C$$`,
                                formulas: [
                                    '$\\int x^a dx = \\dfrac{x^{a+1}}{a+1} + C$',
                                    '$\\int \\dfrac{1}{x} dx = \\ln|x| + C$',
                                    '$\\int e^x dx = e^x + C$',
                                    '$\\int \\sin x dx = -\\cos x + C$',
                                    '$\\int \\cos x dx = \\sin x + C$'
                                ],
                                examples: [
                                    {
                                        title: '例1：基本积分',
                                        content: '求 $\\int (x^2 + 3x - 1)dx$',
                                        solution: `**解：**
$$\\int (x^2 + 3x - 1)dx = \\frac{x^3}{3} + \\frac{3x^2}{2} - x + C$$`
                                    }
                                ],
                                keyPoints: [
                                    '不定积分结果必须加常数 $C$',
                                    '积分与微分互为逆运算',
                                    '熟记基本积分公式是关键',
                                    '验算：对结果求导应得被积函数'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-4-2',
                            name: '换元积分法',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**第一类换元法（凑微分法）**：
设 $\\int f(u)du = F(u) + C$，若 $u = \\varphi(x)$ 可导，则
$$\\int f[\\varphi(x)]\\varphi'(x)dx = F[\\varphi(x)] + C$$

**常用凑微分技巧**：
- $\\int f(ax+b)dx = \\dfrac{1}{a}F(ax+b) + C$
- $\\int f(x^n)x^{n-1}dx = \\dfrac{1}{n}F(x^n) + C$
- $\\int f(\\sin x)\\cos x dx = F(\\sin x) + C$
- $\\int f(e^x)e^x dx = F(e^x) + C$

**第二类换元法**：
设 $x = \\psi(t)$ 单调可导且 $\\psi'(t) \\neq 0$，则
$$\\int f(x)dx = \\int f[\\psi(t)]\\psi'(t)dt$$

**常用三角代换**：
- $\\sqrt{a^2 - x^2}$：令 $x = a\\sin t$
- $\\sqrt{a^2 + x^2}$：令 $x = a\\tan t$
- $\\sqrt{x^2 - a^2}$：令 $x = a\\sec t$`,
                                formulas: [
                                    '$\\int f[\\varphi(x)]\\varphi\'(x)dx = F[\\varphi(x)] + C$',
                                    '$\\sqrt{a^2 - x^2}$：令 $x = a\\sin t$',
                                    '$\\sqrt{a^2 + x^2}$：令 $x = a\\tan t$',
                                    '$\\sqrt{x^2 - a^2}$：令 $x = a\\sec t$'
                                ],
                                examples: [
                                    {
                                        title: '例1：第一类换元',
                                        content: '求 $\\int \\sin^3 x \\cos x dx$',
                                        solution: `**解：** 令 $u = \\sin x$，则 $du = \\cos x dx$
$$\\int \\sin^3 x \\cos x dx = \\int u^3 du = \\frac{u^4}{4} + C = \\frac{\\sin^4 x}{4} + C$$`
                                    },
                                    {
                                        title: '例2：第二类换元',
                                        content: '求 $\\int \\dfrac{1}{\\sqrt{1-x^2}} dx$',
                                        solution: `**解：** 令 $x = \\sin t$，$t \\in (-\\frac{\\pi}{2}, \\frac{\\pi}{2})$，则 $dx = \\cos t dt$
$$\\int \\frac{1}{\\sqrt{1-x^2}} dx = \\int \\frac{\\cos t}{\\cos t} dt = t + C = \\arcsin x + C$$`
                                    }
                                ],
                                keyPoints: [
                                    '第一类换元是复合函数求导的逆运算',
                                    '第二类换元要注意代换后换回原变量',
                                    '三角代换能消去根号',
                                    '选择合适的换元方法是关键'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-4-3',
                            name: '分部积分法',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**分部积分公式**：
$$\\int u dv = uv - \\int v du$$

或等价形式：
$$\\int u v' dx = uv - \\int u' v dx$$

**适用类型**（按优先选取 $u$ 的顺序）：
**反对幂指三**
- 反三角函数
- 对数函数
- 幂函数
- 指数函数
- 三角函数

**常见类型**：
1. $\\int x^n e^x dx$：$u = x^n$，$dv = e^x dx$
2. $\\int x^n \\sin x dx$：$u = x^n$，$dv = \\sin x dx$
3. $\\int x^n \\ln x dx$：$u = \\ln x$，$dv = x^n dx$
4. $\\int e^x \\sin x dx$：需要两次分部积分`,
                                formulas: [
                                    '$\\int u dv = uv - \\int v du$',
                                    '$\\int x e^x dx = xe^x - e^x + C$',
                                    '$\\int \\ln x dx = x\\ln x - x + C$',
                                    '$\\int x^n \\ln x dx = \\dfrac{x^{n+1}}{n+1}\\ln x - \\dfrac{x^{n+1}}{(n+1)^2} + C$'
                                ],
                                examples: [
                                    {
                                        title: '例1：基本分部积分',
                                        content: '求 $\\int x e^x dx$',
                                        solution: `**解：** 设 $u = x$，$dv = e^x dx$，则 $du = dx$，$v = e^x$
$$\\int x e^x dx = xe^x - \\int e^x dx = xe^x - e^x + C = (x-1)e^x + C$$`
                                    },
                                    {
                                        title: '例2：两次分部积分',
                                        content: '求 $\\int e^x \\sin x dx$',
                                        solution: `**解：** 设 $I = \\int e^x \\sin x dx$

第一次：$u = \\sin x$，$dv = e^x dx$
$$I = e^x \\sin x - \\int e^x \\cos x dx$$

第二次：$u = \\cos x$，$dv = e^x dx$
$$I = e^x \\sin x - (e^x \\cos x + \\int e^x \\sin x dx)$$
$$I = e^x \\sin x - e^x \\cos x - I$$
$$2I = e^x(\\sin x - \\cos x)$$
$$I = \\frac{e^x(\\sin x - \\cos x)}{2} + C$$`
                                    }
                                ],
                                keyPoints: [
                                    '分部积分是乘法求导法则的逆运算',
                                    '选取 $u$ 使 $u\'$ 更简单或 $v$ 易求',
                                    '表格法可简化多次分部积分',
                                    '循环型需用方程解出结果'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第五章 定积分
                {
                    id: 'calc-ch5',
                    name: '第五章 定积分',
                    expanded: false,
                    units: [
                        {
                            id: 'calc-5-1',
                            name: '定积分的概念',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**定积分的定义**：
$$\\int_a^b f(x)dx = \\lim_{\\lambda \\to 0} \\sum_{i=1}^n f(\\xi_i)\\Delta x_i$$
其中 $\\lambda = \\max\\{\\Delta x_i\\}$。

**几何意义**：
定积分 $\\int_a^b f(x)dx$ 表示曲线 $y=f(x)$ 与 $x$ 轴、$x=a$、$x=b$ 所围成的曲边梯形的代数面积。

**牛顿-莱布尼茨公式**：
$$\\int_a^b f(x)dx = F(b) - F(a)$$
其中 $F(x)$ 是 $f(x)$ 的任一原函数。`,
                                formulas: [
                                    '$\\int_a^b f(x)dx = F(b) - F(a)$ （牛顿-莱布尼茨）',
                                    '$\\int_a^a f(x)dx = 0$',
                                    '$\\int_a^b f(x)dx = -\\int_b^a f(x)dx$',
                                    '$\\int_a^b f(x)dx = \\int_a^c f(x)dx + \\int_c^b f(x)dx$'
                                ],
                                examples: [
                                    {
                                        title: '例1：计算定积分',
                                        content: '求 $\\int_0^1 x^2 dx$',
                                        solution: `**解：**
$$\\int_0^1 x^2 dx = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{3} - 0 = \\frac{1}{3}$$`
                                    }
                                ],
                                keyPoints: [
                                    '定积分是一个确定的数，不是函数',
                                    '牛顿-莱布尼茨公式是计算定积分的基本方法',
                                    '定积分的几何意义理解有助于估值',
                                    '积分上下限交换要变号'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-5-2',
                            name: '定积分的计算技巧',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**换元积分法**：
$$\\int_a^b f(x)dx = \\int_{\\alpha}^{\\beta} f[\\varphi(t)]\\varphi'(t)dt$$
其中 $x = \\varphi(t)$，$\\varphi(\\alpha) = a$，$\\varphi(\\beta) = b$。

**分部积分法**：
$$\\int_a^b u dv = [uv]_a^b - \\int_a^b v du$$

**利用对称性简化计算**：
- 若 $f(x)$ 在 $[-a, a]$ 上是偶函数：$\\int_{-a}^a f(x)dx = 2\\int_0^a f(x)dx$
- 若 $f(x)$ 在 $[-a, a]$ 上是奇函数：$\\int_{-a}^a f(x)dx = 0$

**华里士公式（点火公式）**：
$$\\int_0^{\\frac{\\pi}{2}} \\sin^n x dx = \\int_0^{\\frac{\\pi}{2}} \\cos^n x dx = \\begin{cases} \\dfrac{(n-1)!!}{n!!} \\cdot \\dfrac{\\pi}{2} & n为偶数 \\\\ \\dfrac{(n-1)!!}{n!!} & n为奇数 \\end{cases}$$`,
                                formulas: [
                                    '$\\int_{-a}^a f(x)dx = 2\\int_0^a f(x)dx$ （偶函数）',
                                    '$\\int_{-a}^a f(x)dx = 0$ （奇函数）',
                                    '$\\int_0^{\\pi} xf(\\sin x)dx = \\dfrac{\\pi}{2}\\int_0^{\\pi} f(\\sin x)dx$',
                                    '$\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$'
                                ],
                                examples: [
                                    {
                                        title: '例1：利用奇偶性',
                                        content: '求 $\\int_{-1}^1 (x^3 + x^2)dx$',
                                        solution: `**解：** $x^3$ 是奇函数，$x^2$ 是偶函数
$$\\int_{-1}^1 (x^3 + x^2)dx = 0 + 2\\int_0^1 x^2 dx = 2 \\cdot \\frac{1}{3} = \\frac{2}{3}$$`
                                    },
                                    {
                                        title: '例2：定积分换元',
                                        content: '求 $\\int_0^1 \\sqrt{1-x^2}dx$',
                                        solution: `**解：** 令 $x = \\sin t$，$dx = \\cos t dt$
当 $x = 0$ 时 $t = 0$；当 $x = 1$ 时 $t = \\frac{\\pi}{2}$
$$\\int_0^1 \\sqrt{1-x^2}dx = \\int_0^{\\frac{\\pi}{2}} \\cos^2 t dt = \\frac{\\pi}{4}$$
（几何意义：这是单位圆在第一象限的面积）`
                                    }
                                ],
                                keyPoints: [
                                    '定积分换元后要同时变换积分上下限',
                                    '换元后不需要换回原变量',
                                    '善用对称性可大大简化计算',
                                    '区间再现公式是重要技巧'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-5-3',
                            name: '定积分的应用',
                            difficulty: 'advanced',
                            content: {
                                concept: `**平面图形的面积**：
1. 直角坐标：$S = \\int_a^b |f(x) - g(x)|dx$
2. 参数方程：$S = \\int_{t_1}^{t_2} |y(t)x'(t)|dt$
3. 极坐标：$S = \\frac{1}{2}\\int_{\\alpha}^{\\beta} r^2(\\theta)d\\theta$

**旋转体的体积**：
- 绕 $x$ 轴旋转：$V_x = \\pi\\int_a^b f^2(x)dx$
- 绕 $y$ 轴旋转（柱壳法）：$V_y = 2\\pi\\int_a^b x|f(x)|dx$

**旋转曲面的面积**：
$$S = 2\\pi\\int_a^b |f(x)|\\sqrt{1 + f'^2(x)}dx$$

**弧长**：
$$s = \\int_a^b \\sqrt{1 + f'^2(x)}dx$$`,
                                formulas: [
                                    '$S = \\int_a^b |f(x) - g(x)|dx$ （面积）',
                                    '$V_x = \\pi\\int_a^b f^2(x)dx$ （绕x轴体积）',
                                    '$V_y = 2\\pi\\int_a^b x|f(x)|dx$ （绕y轴体积）',
                                    '$s = \\int_a^b \\sqrt{1 + f\'^2(x)}dx$ （弧长）'
                                ],
                                examples: [
                                    {
                                        title: '例1：求旋转体体积',
                                        content: '求由 $y = x^2$（$0 \\leq x \\leq 1$）与 $x$ 轴围成的图形绕 $x$ 轴旋转所得旋转体的体积。',
                                        solution: `**解：** 由绕 $x$ 轴旋转体积公式：
$$V = \\pi\\int_0^1 (x^2)^2 dx = \\pi\\int_0^1 x^4 dx$$
$$= \\pi \\cdot \\frac{x^5}{5}\\Big|_0^1 = \\frac{\\pi}{5}$$`
                                    },
                                    {
                                        title: '例2：求弧长',
                                        content: '求曲线 $y = \\ln(\\cos x)$（$0 \\leq x \\leq \\frac{\\pi}{4}$）的弧长。',
                                        solution: `**解：** $y' = \\frac{-\\sin x}{\\cos x} = -\\tan x$
$$\\sqrt{1 + y'^2} = \\sqrt{1 + \\tan^2 x} = \\sec x$$
$$s = \\int_0^{\\frac{\\pi}{4}} \\sec x dx = \\ln|\\sec x + \\tan x|\\Big|_0^{\\frac{\\pi}{4}}$$
$$= \\ln(\\sqrt{2} + 1) - \\ln 1 = \\ln(\\sqrt{2} + 1)$$`
                                    }
                                ],
                                keyPoints: [
                                    '面积要取绝对值，确保非负',
                                    '绕不同轴旋转用不同公式',
                                    '柱壳法适用于绕 $y$ 轴旋转',
                                    '弧长微元：$ds = \\sqrt{1 + y\'^2}dx$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第六章 多元函数微分学
                {
                    id: 'calc-ch6',
                    name: '第六章 多元函数微分学',
                    expanded: false,
                    units: [
                        {
                            id: 'calc-6-1',
                            name: '多元函数的基本概念',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**多元函数的定义**：
设 $D$ 是 $\\mathbb{R}^2$ 的一个非空子集，若存在对应法则 $f$，使得对于 $D$ 中的每一点 $(x, y)$，都有唯一确定的实数 $z$ 与之对应，则称 $f$ 为定义在 $D$ 上的二元函数，记作
$$z = f(x, y), \\quad (x, y) \\in D$$

**极限与连续**：
$$\\lim_{(x,y) \\to (x_0, y_0)} f(x, y) = A$$
若对任意 $\\varepsilon > 0$，存在 $\\delta > 0$，当 $0 < \\sqrt{(x-x_0)^2 + (y-y_0)^2} < \\delta$ 时，$|f(x,y) - A| < \\varepsilon$。

**连续性**：
若 $\\lim_{(x,y) \\to (x_0, y_0)} f(x, y) = f(x_0, y_0)$，则 $f$ 在 $(x_0, y_0)$ 连续。`,
                                formulas: [
                                    '$z = f(x, y)$ （二元函数）',
                                    '$\\lim\\limits_{(x,y) \\to (x_0, y_0)} f(x, y) = A$',
                                    '连续 $\\Leftrightarrow$ 极限值 = 函数值'
                                ],
                                examples: [
                                    {
                                        title: '例1：求二元函数极限',
                                        content: '求 $\\lim\\limits_{(x,y) \\to (0,0)} \\dfrac{xy}{x^2 + y^2}$',
                                        solution: `**解：** 沿 $y = 0$ 趋近：$\\lim\\limits_{x \\to 0} \\dfrac{0}{x^2} = 0$

沿 $y = x$ 趋近：$\\lim\\limits_{x \\to 0} \\dfrac{x^2}{2x^2} = \\dfrac{1}{2}$

沿不同路径极限不同，因此**极限不存在**。`
                                    }
                                ],
                                keyPoints: [
                                    '二元函数极限要求沿任意路径趋近都相同',
                                    '证明极限不存在只需找两条路径得到不同值',
                                    '证明极限存在需用定义或夹逼',
                                    '有界闭区域上连续函数有最大最小值'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-6-2',
                            name: '偏导数与全微分',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**偏导数的定义**：
$$\\frac{\\partial f}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x, y) - f(x, y)}{\\Delta x}$$

**求偏导数方法**：
对 $x$ 求偏导时，将 $y$ 视为常数；对 $y$ 求偏导时，将 $x$ 视为常数。

**全微分**：
若 $\\Delta z = f(x + \\Delta x, y + \\Delta y) - f(x, y)$ 可表示为
$$\\Delta z = A\\Delta x + B\\Delta y + o(\\rho)$$
其中 $\\rho = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$，则称 $f$ 在 $(x, y)$ 可微，全微分为
$$dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy$$

**可微的充分条件**：偏导数连续 $\\Rightarrow$ 可微`,
                                formulas: [
                                    '$f_x = \\dfrac{\\partial f}{\\partial x}$，$f_y = \\dfrac{\\partial f}{\\partial y}$',
                                    '$dz = \\dfrac{\\partial z}{\\partial x}dx + \\dfrac{\\partial z}{\\partial y}dy$',
                                    '可微 $\\Rightarrow$ 连续',
                                    '可微 $\\Rightarrow$ 偏导数存在'
                                ],
                                examples: [
                                    {
                                        title: '例1：求偏导数',
                                        content: '设 $z = x^2y + e^{xy}$，求 $\\dfrac{\\partial z}{\\partial x}$ 和 $\\dfrac{\\partial z}{\\partial y}$。',
                                        solution: `**解：**
$$\\frac{\\partial z}{\\partial x} = 2xy + ye^{xy}$$
$$\\frac{\\partial z}{\\partial y} = x^2 + xe^{xy}$$`
                                    },
                                    {
                                        title: '例2：求全微分',
                                        content: '求 $z = x^2 + xy + y^2$ 的全微分。',
                                        solution: `**解：**
$$\\frac{\\partial z}{\\partial x} = 2x + y, \\quad \\frac{\\partial z}{\\partial y} = x + 2y$$
$$dz = (2x + y)dx + (x + 2y)dy$$`
                                    }
                                ],
                                keyPoints: [
                                    '偏导数存在不能推出连续',
                                    '偏导数存在不能推出可微',
                                    '可微则必连续且偏导数存在',
                                    '偏导数连续是可微的充分非必要条件'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-6-3',
                            name: '多元复合函数求导',
                            difficulty: 'advanced',
                            content: {
                                concept: `**链式法则**：
设 $z = f(u, v)$，$u = \\varphi(x, y)$，$v = \\psi(x, y)$，则
$$\\frac{\\partial z}{\\partial x} = \\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial x}$$
$$\\frac{\\partial z}{\\partial y} = \\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial y} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial y}$$

**一元函数情形**：
若 $z = f(u)$，$u = \\varphi(x, y)$，则
$$\\frac{\\partial z}{\\partial x} = f'(u)\\frac{\\partial u}{\\partial x}$$

**全导数**：
若 $z = f(x, y)$，$y = g(x)$，则
$$\\frac{dz}{dx} = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y}\\frac{dy}{dx}$$`,
                                formulas: [
                                    '$\\dfrac{\\partial z}{\\partial x} = \\dfrac{\\partial f}{\\partial u}\\dfrac{\\partial u}{\\partial x} + \\dfrac{\\partial f}{\\partial v}\\dfrac{\\partial v}{\\partial x}$',
                                    '$\\dfrac{dz}{dx} = \\dfrac{\\partial f}{\\partial x} + \\dfrac{\\partial f}{\\partial y}\\dfrac{dy}{dx}$ （全导数）'
                                ],
                                examples: [
                                    {
                                        title: '例1：复合函数求偏导',
                                        content: '设 $z = e^{u^2 + v}$，$u = x + y$，$v = xy$，求 $\\dfrac{\\partial z}{\\partial x}$。',
                                        solution: `**解：**
$$\\frac{\\partial z}{\\partial u} = 2ue^{u^2 + v}, \\quad \\frac{\\partial z}{\\partial v} = e^{u^2 + v}$$
$$\\frac{\\partial u}{\\partial x} = 1, \\quad \\frac{\\partial v}{\\partial x} = y$$
$$\\frac{\\partial z}{\\partial x} = 2ue^{u^2 + v} \\cdot 1 + e^{u^2 + v} \\cdot y$$
$$= e^{(x+y)^2 + xy}[2(x+y) + y]$$`
                                    }
                                ],
                                keyPoints: [
                                    '画出变量依赖关系图有助于理解',
                                    '每条路径上的导数相乘，不同路径相加',
                                    '注意区分偏导数和全导数',
                                    '求导后代入中间变量表达式'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'calc-6-4',
                            name: '隐函数求导',
                            difficulty: 'advanced',
                            content: {
                                concept: `**隐函数存在定理**：
设 $F(x, y)$ 在点 $(x_0, y_0)$ 的某邻域内有连续偏导数，且 $F(x_0, y_0) = 0$，$F_y(x_0, y_0) \\neq 0$，则方程 $F(x, y) = 0$ 在点 $(x_0, y_0)$ 的某邻域内确定唯一的隐函数 $y = f(x)$，且
$$\\frac{dy}{dx} = -\\frac{F_x}{F_y}$$

**二元隐函数**：
若 $F(x, y, z) = 0$ 确定 $z = z(x, y)$，则
$$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}, \\quad \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}$$

**方程组确定隐函数**：
设 $\\begin{cases} F(x, y, u, v) = 0 \\\\ G(x, y, u, v) = 0 \\end{cases}$ 确定 $u = u(x, y)$，$v = v(x, y)$，则用雅可比行列式求解。`,
                                formulas: [
                                    '$\\dfrac{dy}{dx} = -\\dfrac{F_x}{F_y}$',
                                    '$\\dfrac{\\partial z}{\\partial x} = -\\dfrac{F_x}{F_z}$，$\\dfrac{\\partial z}{\\partial y} = -\\dfrac{F_y}{F_z}$',
                                    'J = $\\dfrac{\\partial(F, G)}{\\partial(u, v)}$ （雅可比行列式）'
                                ],
                                examples: [
                                    {
                                        title: '例1：一元隐函数求导',
                                        content: '设 $e^y + xy - e = 0$ 确定 $y = y(x)$，求 $\\dfrac{dy}{dx}\\Big|_{x=0}$。',
                                        solution: `**解：** 设 $F(x, y) = e^y + xy - e$
$$F_x = y, \\quad F_y = e^y + x$$
$$\\frac{dy}{dx} = -\\frac{F_x}{F_y} = -\\frac{y}{e^y + x}$$

当 $x = 0$ 时，$e^y - e = 0$，得 $y = 1$
$$\\frac{dy}{dx}\\Big|_{x=0} = -\\frac{1}{e + 0} = -\\frac{1}{e}$$`
                                    },
                                    {
                                        title: '例2：二元隐函数求偏导',
                                        content: '设 $x^2 + y^2 + z^2 = 1$ 确定 $z = z(x, y)$，求 $\\dfrac{\\partial z}{\\partial x}$。',
                                        solution: `**解：** 设 $F = x^2 + y^2 + z^2 - 1$
$$F_x = 2x, \\quad F_z = 2z$$
$$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z} = -\\frac{2x}{2z} = -\\frac{x}{z}$$`
                                    }
                                ],
                                keyPoints: [
                                    '隐函数求导公式的分母不能为0',
                                    '代入具体点时要先求出该点的坐标',
                                    '方程组用雅可比行列式方法',
                                    '也可以直接对方程两边求偏导'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                }
            ]
        },

        // ==================== 线性代数 ====================
        linearAlgebra: {
            id: 'linearAlgebra',
            name: '线性代数',
            icon: '📊',
            progress: 0,
            expanded: false,
            chapters: [
                // 第一章 行列式
                {
                    id: 'la-ch1',
                    name: '第一章 行列式',
                    expanded: false,
                    units: [
                        {
                            id: 'la-1-1',
                            name: '行列式的概念与性质',
                            difficulty: 'basic',
                            content: {
                                concept: `**行列式的定义**：
$n$ 阶行列式是由 $n^2$ 个元素按一定规则组成的数值。

**二阶行列式**：
$$\\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}$$

**三阶行列式**（对角线法则）：
$$\\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$$
= 主对角线三项之积的和 - 副对角线三项之积的和

**行列式的性质**：
1. $|A^T| = |A|$
2. 互换两行（列），行列式变号
3. 某行（列）有公因子可提出
4. 两行（列）相同或成比例，行列式为0
5. $|kA| = k^n|A|$（$n$ 阶）
6. $|AB| = |A| \\cdot |B|$`,
                                formulas: [
                                    '$|A^T| = |A|$',
                                    '$|kA| = k^n|A|$（$n$阶方阵）',
                                    '$|AB| = |A| \\cdot |B|$',
                                    '$|A^{-1}| = \\dfrac{1}{|A|}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：计算二阶行列式',
                                        content: '计算 $\\begin{vmatrix} 2 & 3 \\\\ 1 & 4 \\end{vmatrix}$',
                                        solution: `**解：**
$$\\begin{vmatrix} 2 & 3 \\\\ 1 & 4 \\end{vmatrix} = 2 \\times 4 - 3 \\times 1 = 8 - 3 = 5$$`
                                    }
                                ],
                                keyPoints: [
                                    '行列式是一个数值，不是矩阵',
                                    '行列式的计算可用展开公式或性质化简',
                                    '行变换和列变换对行列式值的影响不同',
                                    '熟记几种特殊行列式的值'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-1-2',
                            name: '行列式的计算',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**按行（列）展开定理**：
行列式等于某一行（列）元素与其代数余子式乘积之和：
$$|A| = \\sum_{j=1}^n a_{ij}A_{ij}$$

其中 $A_{ij} = (-1)^{i+j}M_{ij}$，$M_{ij}$ 是余子式。

**常用计算技巧**：
1. 化为上（下）三角形
2. 按某行（列）展开
3. 利用行列式性质化简
4. 递推法（对于有规律的行列式）

**特殊行列式**：
- 上（下）三角行列式 = 主对角线元素之积
- 范德蒙行列式`,
                                formulas: [
                                    '$|A| = \\sum_{j=1}^n a_{ij}A_{ij}$ （按第 $i$ 行展开）',
                                    '$A_{ij} = (-1)^{i+j}M_{ij}$ （代数余子式）',
                                    '上三角行列式 $= a_{11}a_{22}\\cdots a_{nn}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：按行展开',
                                        content: '计算 $\\begin{vmatrix} 1 & 2 & 0 \\\\ 0 & 3 & 1 \\\\ 2 & 0 & 1 \\end{vmatrix}$',
                                        solution: `**解：** 按第一行展开：
$$= 1 \\cdot \\begin{vmatrix} 3 & 1 \\\\ 0 & 1 \\end{vmatrix} - 2 \\cdot \\begin{vmatrix} 0 & 1 \\\\ 2 & 1 \\end{vmatrix} + 0$$
$$= 1 \\times 3 - 2 \\times (-2) = 3 + 4 = 7$$`
                                    }
                                ],
                                keyPoints: [
                                    '展开时选择零元素多的行或列',
                                    '化简时尽量产生更多的零',
                                    '注意代数余子式的符号',
                                    '高阶行列式要善用性质化简'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第二章 矩阵
                {
                    id: 'la-ch2',
                    name: '第二章 矩阵',
                    expanded: false,
                    units: [
                        {
                            id: 'la-2-1',
                            name: '矩阵的运算',
                            difficulty: 'basic',
                            content: {
                                concept: `**矩阵加法**：同型矩阵对应元素相加

**矩阵数乘**：每个元素乘以数 $k$

**矩阵乘法**：$A_{m×n} \\cdot B_{n×p} = C_{m×p}$
$$c_{ij} = \\sum_{k=1}^n a_{ik}b_{kj}$$

**矩阵乘法性质**：
- 一般 $AB \\neq BA$（不满足交换律）
- $(AB)C = A(BC)$（结合律）
- $A(B+C) = AB + AC$（分配律）

**矩阵转置**：$(A^T)_{ij} = A_{ji}$
- $(A^T)^T = A$
- $(A+B)^T = A^T + B^T$
- $(AB)^T = B^T A^T$`,
                                formulas: [
                                    '$(AB)^T = B^T A^T$',
                                    '$(AB)C = A(BC)$',
                                    '$A(B+C) = AB + AC$',
                                    '$(kA)^T = kA^T$'
                                ],
                                examples: [
                                    {
                                        title: '例1：矩阵乘法',
                                        content: '计算 $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix}$',
                                        solution: `**解：**
$$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 1×5+2×6 \\\\ 3×5+4×6 \\end{pmatrix} = \\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix}$$`
                                    }
                                ],
                                keyPoints: [
                                    '矩阵乘法要求左矩阵列数等于右矩阵行数',
                                    '矩阵乘法不满足交换律',
                                    '转置的乘积要反序',
                                    '$AB = O$ 不能推出 $A = O$ 或 $B = O$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-2-2',
                            name: '逆矩阵',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**逆矩阵的定义**：
若 $AB = BA = E$，则称 $B$ 是 $A$ 的逆矩阵，记作 $A^{-1}$。

**可逆的充要条件**：$|A| \\neq 0$

**逆矩阵的性质**：
- $(A^{-1})^{-1} = A$
- $(kA)^{-1} = \\dfrac{1}{k}A^{-1}$
- $(AB)^{-1} = B^{-1}A^{-1}$
- $(A^T)^{-1} = (A^{-1})^T$

**求逆矩阵的方法**：
1. 公式法：$A^{-1} = \\dfrac{1}{|A|}A^*$
2. 初等变换法：$(A|E) \\to (E|A^{-1})$`,
                                formulas: [
                                    '$A^{-1} = \\dfrac{1}{|A|}A^*$',
                                    '$(AB)^{-1} = B^{-1}A^{-1}$',
                                    '$(A^T)^{-1} = (A^{-1})^T$',
                                    '$|A^{-1}| = \\dfrac{1}{|A|}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求逆矩阵',
                                        content: '求 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 的逆矩阵。',
                                        solution: `**解：** $|A| = 4 - 6 = -2 \\neq 0$，可逆。

$A^* = \\begin{pmatrix} 4 & -2 \\\\ -3 & 1 \\end{pmatrix}$

$A^{-1} = \\dfrac{1}{-2}\\begin{pmatrix} 4 & -2 \\\\ -3 & 1 \\end{pmatrix} = \\begin{pmatrix} -2 & 1 \\\\ \\frac{3}{2} & -\\frac{1}{2} \\end{pmatrix}$`
                                    }
                                ],
                                keyPoints: [
                                    '只有方阵才可能有逆矩阵',
                                    '逆矩阵的乘积要反序',
                                    '初等变换法适用于高阶矩阵',
                                    '伴随矩阵 $A^* = |A| \\cdot A^{-1}$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-2-3',
                            name: '矩阵的秩',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**矩阵秩的定义**：
矩阵 $A$ 的秩是指 $A$ 的非零子式的最高阶数，记作 $r(A)$ 或 $\\text{rank}(A)$。

**秩的等价刻画**：
- $r(A)$ = 行向量组的秩 = 列向量组的秩
- $r(A)$ = $A$ 的行阶梯形矩阵的非零行数

**秩的性质**：
1. $r(A) = r(A^T)$
2. $r(kA) = r(A)$（$k \\neq 0$）
3. $r(A + B) \\leq r(A) + r(B)$
4. $r(AB) \\leq \\min\\{r(A), r(B)\\}$
5. 若 $A$ 可逆，则 $r(AB) = r(B)$，$r(BA) = r(B)$

**初等变换与秩**：
初等变换不改变矩阵的秩。`,
                                formulas: [
                                    '$r(A) = r(A^T)$',
                                    '$r(AB) \\leq \\min\\{r(A), r(B)\\}$',
                                    '$r(A + B) \\leq r(A) + r(B)$',
                                    '$r(A) + r(B) - n \\leq r(AB)$ （西尔维斯特不等式）'
                                ],
                                examples: [
                                    {
                                        title: '例1：求矩阵的秩',
                                        content: '求 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{pmatrix}$ 的秩。',
                                        solution: `**解：** 用初等行变换化为阶梯形：
$$\\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{pmatrix} \\xrightarrow{r_2-2r_1, r_3-r_1} \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 0 & 0 \\\\ 0 & -1 & -2 \\end{pmatrix}$$
$$\\xrightarrow{r_2 \\leftrightarrow r_3} \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & -1 & -2 \\\\ 0 & 0 & 0 \\end{pmatrix}$$

有2个非零行，因此 $r(A) = 2$。`
                                    }
                                ],
                                keyPoints: [
                                    '满秩矩阵：$r(A) = \\min\\{m, n\\}$',
                                    '可逆矩阵的秩等于阶数',
                                    '用初等行变换化为阶梯形求秩',
                                    '$r(A^TA) = r(AA^T) = r(A)$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第三章 向量
                {
                    id: 'la-ch3',
                    name: '第三章 向量',
                    expanded: false,
                    units: [
                        {
                            id: 'la-3-1',
                            name: '向量的线性相关性',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**线性组合**：
若 $\\beta = k_1\\alpha_1 + k_2\\alpha_2 + \\cdots + k_n\\alpha_n$，则称 $\\beta$ 是 $\\alpha_1, \\alpha_2, \\ldots, \\alpha_n$ 的线性组合。

**线性相关**：
若存在不全为零的 $k_1, k_2, \\ldots, k_n$，使得
$$k_1\\alpha_1 + k_2\\alpha_2 + \\cdots + k_n\\alpha_n = 0$$
则称向量组线性相关；否则线性无关。

**判定定理**：
1. 向量组线性相关 $\\Leftrightarrow$ 齐次方程组有非零解 $\\Leftrightarrow$ $r(A) < n$
2. $n$ 个 $n$ 维向量线性相关 $\\Leftrightarrow$ $|A| = 0$
3. 向量组中有一个向量可由其他向量线性表出 $\\Leftrightarrow$ 线性相关`,
                                formulas: [
                                    '$k_1\\alpha_1 + k_2\\alpha_2 + \\cdots + k_n\\alpha_n = 0$',
                                    '线性相关 $\\Leftrightarrow$ $r(A) < n$',
                                    '$n$ 维向量组线性相关 $\\Leftrightarrow$ $|A| = 0$'
                                ],
                                examples: [
                                    {
                                        title: '例1：判断线性相关性',
                                        content: '判断向量组 $\\alpha_1 = (1,2,3)^T$, $\\alpha_2 = (2,4,6)^T$ 的线性相关性。',
                                        solution: `**解：** 观察发现 $\\alpha_2 = 2\\alpha_1$

因此 $2\\alpha_1 - \\alpha_2 = 0$，存在不全为零的系数。

所以向量组**线性相关**。`
                                    }
                                ],
                                keyPoints: [
                                    '含零向量的向量组必线性相关',
                                    '向量个数大于维数必线性相关',
                                    '线性无关向量组的部分组也线性无关',
                                    '线性相关向量组的扩充组也线性相关'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-3-2',
                            name: '向量空间与基',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**向量空间**：
若向量集合 $V$ 对加法和数乘运算封闭，则称 $V$ 为向量空间。

**极大线性无关组**：
向量组的一个部分组，满足：
1. 该部分组线性无关
2. 原向量组中每个向量都可由该部分组线性表出

**向量组的秩**：
极大线性无关组所含向量的个数，记作 $r(\\alpha_1, \\alpha_2, \\ldots, \\alpha_s)$。

**基与维数**：
若向量空间 $V$ 的一组基含有 $n$ 个向量，则称 $V$ 是 $n$ 维向量空间。

**坐标**：
若 $\\alpha = x_1e_1 + x_2e_2 + \\cdots + x_ne_n$，则 $(x_1, x_2, \\ldots, x_n)^T$ 是 $\\alpha$ 在基 $e_1, e_2, \\ldots, e_n$ 下的坐标。`,
                                formulas: [
                                    '$r(\\alpha_1, \\ldots, \\alpha_s) \\leq \\min\\{s, n\\}$',
                                    '向量组与其极大线性无关组等价',
                                    '$\\dim V$ = 基的向量个数'
                                ],
                                examples: [
                                    {
                                        title: '例1：求极大线性无关组',
                                        content: '求向量组 $\\alpha_1 = (1,1,0)^T$, $\\alpha_2 = (1,0,1)^T$, $\\alpha_3 = (2,1,1)^T$ 的极大线性无关组。',
                                        solution: `**解：** 构造矩阵 $A = (\\alpha_1, \\alpha_2, \\alpha_3)$ 并化简：
$$\\begin{pmatrix} 1 & 1 & 2 \\\\ 1 & 0 & 1 \\\\ 0 & 1 & 1 \\end{pmatrix} \\to \\begin{pmatrix} 1 & 1 & 2 \\\\ 0 & -1 & -1 \\\\ 0 & 1 & 1 \\end{pmatrix} \\to \\begin{pmatrix} 1 & 1 & 2 \\\\ 0 & -1 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}$$

$r(A) = 2$，极大线性无关组为 $\\{\\alpha_1, \\alpha_2\\}$。
且 $\\alpha_3 = \\alpha_1 + \\alpha_2$。`
                                    }
                                ],
                                keyPoints: [
                                    '极大线性无关组不唯一，但秩唯一',
                                    '等价向量组具有相同的秩',
                                    '向量组的秩等于其生成矩阵的秩',
                                    '基变换公式：$x\' = P^{-1}x$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-3-3',
                            name: '施密特正交化',
                            difficulty: 'advanced',
                            content: {
                                concept: `**内积**：
$$\\langle \\alpha, \\beta \\rangle = \\alpha^T \\beta = \\sum_{i=1}^n a_i b_i$$

**向量的模**：
$$\\|\\alpha\\| = \\sqrt{\\langle \\alpha, \\alpha \\rangle}$$

**正交**：
若 $\\langle \\alpha, \\beta \\rangle = 0$，则 $\\alpha$ 与 $\\beta$ 正交。

**施密特正交化**：
将线性无关组 $\\alpha_1, \\alpha_2, \\ldots, \\alpha_n$ 化为正交组：
$$\\beta_1 = \\alpha_1$$
$$\\beta_2 = \\alpha_2 - \\frac{\\langle \\alpha_2, \\beta_1 \\rangle}{\\langle \\beta_1, \\beta_1 \\rangle}\\beta_1$$
$$\\beta_3 = \\alpha_3 - \\frac{\\langle \\alpha_3, \\beta_1 \\rangle}{\\langle \\beta_1, \\beta_1 \\rangle}\\beta_1 - \\frac{\\langle \\alpha_3, \\beta_2 \\rangle}{\\langle \\beta_2, \\beta_2 \\rangle}\\beta_2$$

**单位化**：
$$e_i = \\frac{\\beta_i}{\\|\\beta_i\\|}$$`,
                                formulas: [
                                    '$\\langle \\alpha, \\beta \\rangle = \\alpha^T \\beta$',
                                    '$\\|\\alpha\\| = \\sqrt{\\alpha^T \\alpha}$',
                                    '$\\beta_k = \\alpha_k - \\sum_{i=1}^{k-1} \\dfrac{\\langle \\alpha_k, \\beta_i \\rangle}{\\langle \\beta_i, \\beta_i \\rangle}\\beta_i$'
                                ],
                                examples: [
                                    {
                                        title: '例1：施密特正交化',
                                        content: '将 $\\alpha_1 = (1,1,0)^T$, $\\alpha_2 = (1,0,1)^T$ 正交化。',
                                        solution: `**解：**
$\\beta_1 = \\alpha_1 = (1,1,0)^T$

$\\langle \\alpha_2, \\beta_1 \\rangle = 1$，$\\langle \\beta_1, \\beta_1 \\rangle = 2$

$\\beta_2 = \\alpha_2 - \\dfrac{1}{2}\\beta_1 = (1,0,1)^T - \\dfrac{1}{2}(1,1,0)^T = (\\dfrac{1}{2}, -\\dfrac{1}{2}, 1)^T$

验证：$\\langle \\beta_1, \\beta_2 \\rangle = \\dfrac{1}{2} - \\dfrac{1}{2} + 0 = 0$ ✓`
                                    }
                                ],
                                keyPoints: [
                                    '正交向量组必线性无关',
                                    '正交化后再单位化得到标准正交基',
                                    '正交矩阵：$A^TA = E$',
                                    '正交矩阵的列向量构成标准正交基'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第四章 线性方程组
                {
                    id: 'la-ch4',
                    name: '第四章 线性方程组',
                    expanded: false,
                    units: [
                        {
                            id: 'la-4-1',
                            name: '齐次线性方程组',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**齐次线性方程组**：
$$Ax = 0$$

**有非零解的条件**：
$Ax = 0$ 有非零解 $\\Leftrightarrow$ $r(A) < n$（未知数个数）

**解的结构**：
1. 解向量的线性组合仍是解
2. 基础解系：解空间的一组基
3. 基础解系含 $n - r(A)$ 个向量

**通解**：
$$x = c_1\\xi_1 + c_2\\xi_2 + \\cdots + c_{n-r}\\xi_{n-r}$$
其中 $\\xi_1, \\xi_2, \\ldots, \\xi_{n-r}$ 是基础解系，$c_1, c_2, \\ldots, c_{n-r}$ 是任意常数。`,
                                formulas: [
                                    '有非零解 $\\Leftrightarrow$ $r(A) < n$',
                                    '基础解系含 $n - r(A)$ 个向量',
                                    '$x = c_1\\xi_1 + c_2\\xi_2 + \\cdots + c_{n-r}\\xi_{n-r}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求基础解系',
                                        content: '求齐次方程组 $\\begin{cases} x_1 + x_2 + x_3 = 0 \\\\ x_1 - x_2 + x_3 = 0 \\end{cases}$ 的基础解系。',
                                        solution: `**解：** 系数矩阵化简：
$$\\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & -1 & 1 \\end{pmatrix} \\to \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & -2 & 0 \\end{pmatrix} \\to \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 0 \\end{pmatrix}$$

$r(A) = 2$，$n = 3$，基础解系含 $3 - 2 = 1$ 个向量。

令 $x_3 = 1$，则 $x_1 = -1$，$x_2 = 0$
基础解系：$\\xi = (-1, 0, 1)^T$
通解：$x = c(-1, 0, 1)^T$`
                                    }
                                ],
                                keyPoints: [
                                    '$r(A) = n$ 时只有零解',
                                    '基础解系不唯一',
                                    '自由变量取单位向量得基础解系',
                                    '解空间的维数 = $n - r(A)$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-4-2',
                            name: '非齐次线性方程组',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**非齐次线性方程组**：
$$Ax = b \\quad (b \\neq 0)$$

**有解条件**：
$Ax = b$ 有解 $\\Leftrightarrow$ $r(A) = r(A, b)$

**解的唯一性**：
- $r(A) = r(A, b) = n$：唯一解
- $r(A) = r(A, b) < n$：无穷多解

**解的结构**：
$$x = x_0 + c_1\\xi_1 + c_2\\xi_2 + \\cdots + c_{n-r}\\xi_{n-r}$$
其中 $x_0$ 是特解，$\\xi_1, \\ldots, \\xi_{n-r}$ 是对应齐次方程组的基础解系。

**几何意义**：
非齐次方程组的解集是对应齐次方程组解空间的一个平移。`,
                                formulas: [
                                    '有解 $\\Leftrightarrow$ $r(A) = r(A, b)$',
                                    '$x = x_0 + x_齐$（特解 + 齐次通解）',
                                    '唯一解 $\\Leftrightarrow$ $r(A) = n$'
                                ],
                                examples: [
                                    {
                                        title: '例1：解非齐次方程组',
                                        content: '求方程组 $\\begin{cases} x_1 + x_2 + x_3 = 1 \\\\ x_1 - x_2 + x_3 = 1 \\end{cases}$ 的通解。',
                                        solution: `**解：** 增广矩阵化简：
$$\\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 1 & -1 & 1 & 1 \\end{pmatrix} \\to \\begin{pmatrix} 1 & 0 & 1 & 1 \\\\ 0 & 1 & 0 & 0 \\end{pmatrix}$$

$r(A) = r(A, b) = 2$，有解。

特解：令 $x_3 = 0$，得 $x_0 = (1, 0, 0)^T$
齐次基础解系：$\\xi = (-1, 0, 1)^T$

通解：$x = (1, 0, 0)^T + c(-1, 0, 1)^T$`
                                    }
                                ],
                                keyPoints: [
                                    '先判断有无解，再求解',
                                    '特解 + 齐次通解 = 非齐次通解',
                                    '用增广矩阵判断相容性',
                                    '克莱默法则适用于 $n$ 元 $n$ 方程'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第五章 特征值与特征向量
                {
                    id: 'la-ch5',
                    name: '第五章 特征值与特征向量',
                    expanded: false,
                    units: [
                        {
                            id: 'la-5-1',
                            name: '特征值与特征向量',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**定义**：
若存在数 $\\lambda$ 和非零向量 $\\xi$，使得
$$A\\xi = \\lambda\\xi$$
则称 $\\lambda$ 是 $A$ 的特征值，$\\xi$ 是对应的特征向量。

**特征方程**：
$$|A - \\lambda E| = 0$$

**特征值的性质**：
1. $\\sum_{i=1}^n \\lambda_i = \\text{tr}(A)$（迹）
2. $\\prod_{i=1}^n \\lambda_i = |A|$
3. $A$ 可逆 $\\Leftrightarrow$ 所有特征值非零

**特征向量的性质**：
1. 属于不同特征值的特征向量线性无关
2. 属于同一特征值的特征向量的线性组合（非零）仍是该特征值的特征向量`,
                                formulas: [
                                    '$A\\xi = \\lambda\\xi$',
                                    '$|A - \\lambda E| = 0$（特征方程）',
                                    '$\\sum \\lambda_i = \\text{tr}(A)$',
                                    '$\\prod \\lambda_i = |A|$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求特征值和特征向量',
                                        content: '求 $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ 的特征值和特征向量。',
                                        solution: `**解：**
$$|A - \\lambda E| = \\begin{vmatrix} 3-\\lambda & 1 \\\\ 1 & 3-\\lambda \\end{vmatrix} = (3-\\lambda)^2 - 1 = 0$$
$$\\lambda^2 - 6\\lambda + 8 = 0 \\Rightarrow \\lambda_1 = 4, \\lambda_2 = 2$$

$\\lambda_1 = 4$：$(A - 4E)\\xi = 0$
$$\\begin{pmatrix} -1 & 1 \\\\ 1 & -1 \\end{pmatrix}\\xi = 0 \\Rightarrow \\xi_1 = (1, 1)^T$$

$\\lambda_2 = 2$：$(A - 2E)\\xi = 0$
$$\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}\\xi = 0 \\Rightarrow \\xi_2 = (1, -1)^T$$`
                                    }
                                ],
                                keyPoints: [
                                    '特征向量不能是零向量',
                                    '$k$ 重特征值最多有 $k$ 个线性无关特征向量',
                                    '$A^n$ 的特征值是 $\\lambda^n$',
                                    '$A^{-1}$ 的特征值是 $1/\\lambda$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-5-2',
                            name: '相似矩阵与对角化',
                            difficulty: 'advanced',
                            content: {
                                concept: `**相似矩阵**：
若存在可逆矩阵 $P$，使得 $P^{-1}AP = B$，则称 $A$ 与 $B$ 相似，记作 $A \\sim B$。

**相似矩阵的性质**：
相似矩阵具有相同的：
1. 行列式
2. 秩
3. 迹
4. 特征值
5. 特征多项式

**对角化条件**：
$A$ 可对角化 $\\Leftrightarrow$ $A$ 有 $n$ 个线性无关的特征向量
$\\Leftrightarrow$ 每个 $k$ 重特征值有 $k$ 个线性无关特征向量

**对角化方法**：
若 $P = (\\xi_1, \\xi_2, \\ldots, \\xi_n)$，$\\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$，则
$$P^{-1}AP = \\Lambda$$`,
                                formulas: [
                                    '$P^{-1}AP = B$（相似定义）',
                                    '$A \\sim B \\Rightarrow |A| = |B|$，$r(A) = r(B)$',
                                    '$P^{-1}AP = \\Lambda$（对角化）'
                                ],
                                examples: [
                                    {
                                        title: '例1：判断能否对角化',
                                        content: '判断 $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ 能否对角化。',
                                        solution: `**解：**
$$|A - \\lambda E| = (1 - \\lambda)^2 = 0 \\Rightarrow \\lambda = 1 \\text{（二重）}$$

$(A - E)\\xi = 0$：
$$\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}\\xi = 0$$
$r(A - E) = 1$，基础解系只有 $1$ 个向量。

二重特征值只有 $1$ 个线性无关特征向量，**不能对角化**。`
                                    }
                                ],
                                keyPoints: [
                                    '有 $n$ 个不同特征值必可对角化',
                                    '实对称矩阵必可对角化',
                                    '$P$ 的列是按顺序排列的特征向量',
                                    '$A^n = P\\Lambda^n P^{-1}$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-5-3',
                            name: '实对称矩阵',
                            difficulty: 'advanced',
                            content: {
                                concept: `**实对称矩阵的性质**：
1. 特征值都是实数
2. 不同特征值对应的特征向量正交
3. 必可正交对角化：存在正交矩阵 $Q$，使得
$$Q^TAQ = Q^{-1}AQ = \\Lambda$$

**正交对角化步骤**：
1. 求特征值 $\\lambda_1, \\lambda_2, \\ldots, \\lambda_n$
2. 求各特征值对应的特征向量
3. 同一特征值的特征向量施密特正交化
4. 所有特征向量单位化
5. 按顺序排成正交矩阵 $Q$

**谱分解**：
$$A = \\lambda_1 q_1 q_1^T + \\lambda_2 q_2 q_2^T + \\cdots + \\lambda_n q_n q_n^T$$`,
                                formulas: [
                                    '$Q^TAQ = \\Lambda$（正交对角化）',
                                    '$Q^T = Q^{-1}$（正交矩阵）',
                                    '$A = Q\\Lambda Q^T$'
                                ],
                                examples: [
                                    {
                                        title: '例1：正交对角化',
                                        content: '正交对角化 $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$。',
                                        solution: `**解：**
特征值：$\\lambda_1 = 1$，$\\lambda_2 = -1$

$\\lambda_1 = 1$：$\\xi_1 = (1, 1)^T$
$\\lambda_2 = -1$：$\\xi_2 = (1, -1)^T$

单位化：
$$q_1 = \\frac{1}{\\sqrt{2}}(1, 1)^T, \\quad q_2 = \\frac{1}{\\sqrt{2}}(1, -1)^T$$

$$Q = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}, \\quad \\Lambda = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$`
                                    }
                                ],
                                keyPoints: [
                                    '实对称矩阵必可正交对角化',
                                    '不同特征值的特征向量自动正交',
                                    '同一特征值的特征向量需正交化',
                                    '正交矩阵的行列式为 $\\pm 1$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第六章 二次型
                {
                    id: 'la-ch6',
                    name: '第六章 二次型',
                    expanded: false,
                    units: [
                        {
                            id: 'la-6-1',
                            name: '二次型及其标准形',
                            difficulty: 'advanced',
                            content: {
                                concept: `**二次型的定义**：
$$f(x_1, \\ldots, x_n) = \\sum_{i=1}^n \\sum_{j=1}^n a_{ij}x_i x_j = x^T A x$$
其中 $A$ 是对称矩阵，称为二次型矩阵。

**标准形**：
只含平方项的二次型：
$$d_1 y_1^2 + d_2 y_2^2 + \\cdots + d_n y_n^2$$

**化标准形的方法**：
1. **正交变换法**：$x = Qy$，$Q$ 是正交矩阵
   $$f = x^TAx = y^T(Q^TAQ)y = \\sum \\lambda_i y_i^2$$

2. **配方法**：逐步配方消去交叉项

**规范形**：
系数只有 $1, -1, 0$ 的标准形。`,
                                formulas: [
                                    '$f = x^TAx$（二次型矩阵表示）',
                                    '$x = Qy \\Rightarrow f = y^T\\Lambda y$',
                                    '惯性定理：正负惯性指数不变'
                                ],
                                examples: [
                                    {
                                        title: '例1：化二次型为标准形',
                                        content: '用正交变换化 $f = 2x_1 x_2$ 为标准形。',
                                        solution: `**解：** $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$

特征值：$\\lambda_1 = 1$，$\\lambda_2 = -1$

正交矩阵 $Q = \\dfrac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$

令 $x = Qy$，则
$$f = y_1^2 - y_2^2$$`
                                    }
                                ],
                                keyPoints: [
                                    '二次型与对称矩阵一一对应',
                                    '正交变换不改变向量长度',
                                    '正惯性指数 = 正特征值个数',
                                    '秩 = 非零特征值个数'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'la-6-2',
                            name: '正定二次型',
                            difficulty: 'advanced',
                            content: {
                                concept: `**正定二次型**：
对于任意非零向量 $x$，都有 $f(x) = x^TAx > 0$，则称 $f$ 是正定二次型，$A$ 是正定矩阵。

**正定的充要条件**：
1. 所有特征值大于 $0$
2. 正惯性指数等于 $n$
3. 所有顺序主子式大于 $0$
4. 存在可逆矩阵 $C$，使得 $A = C^TC$

**半正定**：
对于任意 $x$，都有 $f(x) \\geq 0$
$\\Leftrightarrow$ 所有特征值 $\\geq 0$
$\\Leftrightarrow$ 所有主子式 $\\geq 0$

**负定**：
$f(x) < 0$ 对所有非零 $x$ 成立
$\\Leftrightarrow$ $-A$ 正定`,
                                formulas: [
                                    '正定 $\\Leftrightarrow$ 所有 $\\lambda_i > 0$',
                                    '正定 $\\Leftrightarrow$ 顺序主子式都 $> 0$',
                                    '正定 $\\Leftrightarrow$ $A = C^TC$，$C$ 可逆'
                                ],
                                examples: [
                                    {
                                        title: '例1：判断正定性',
                                        content: '判断 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 是否正定。',
                                        solution: `**解：** 方法一（顺序主子式）：
$D_1 = 2 > 0$
$D_2 = |A| = 4 - 1 = 3 > 0$

所有顺序主子式大于0，$A$ **正定**。

方法二（特征值）：
$|A - \\lambda E| = (2-\\lambda)^2 - 1 = 0$
$\\lambda_1 = 3 > 0$，$\\lambda_2 = 1 > 0$

所有特征值大于0，$A$ **正定**。`
                                    }
                                ],
                                keyPoints: [
                                    '正定矩阵必可逆',
                                    '正定矩阵的特征值都为正',
                                    '实对称正定矩阵可分解为 $A = LL^T$',
                                    '正定矩阵的逆矩阵也正定'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                }
            ]
        },

        // ==================== 概率论 ====================
        probability: {
            id: 'probability',
            name: '概率论与数理统计',
            icon: '🎲',
            progress: 0,
            expanded: false,
            chapters: [
                // 第一章 随机事件与概率
                {
                    id: 'prob-ch1',
                    name: '第一章 随机事件与概率',
                    expanded: false,
                    units: [
                        {
                            id: 'prob-1-1',
                            name: '概率的基本概念',
                            difficulty: 'basic',
                            content: {
                                concept: `**随机试验**：
满足三个条件：可重复、结果多于一个、无法预知结果。

**样本空间**：所有可能结果的集合，记作 $\\Omega$。

**随机事件**：样本空间的子集，记作 $A, B, C$ 等。

**概率的公理化定义**：
概率 $P$ 是定义在事件集上的实值函数，满足：
1. 非负性：$P(A) \\geq 0$
2. 规范性：$P(\\Omega) = 1$
3. 可列可加性：若 $A_i$ 两两互斥，则 $P(\\bigcup_{i=1}^{\\infty} A_i) = \\sum_{i=1}^{\\infty} P(A_i)$

**概率的性质**：
- $P(\\bar{A}) = 1 - P(A)$
- $P(A \\cup B) = P(A) + P(B) - P(AB)$
- $P(A - B) = P(A) - P(AB)$`,
                                formulas: [
                                    '$P(A) + P(\\bar{A}) = 1$',
                                    '$P(A \\cup B) = P(A) + P(B) - P(AB)$',
                                    '$P(A - B) = P(A) - P(AB)$',
                                    '$A \\subset B \\Rightarrow P(A) \\leq P(B)$'
                                ],
                                examples: [
                                    {
                                        title: '例1：概率计算',
                                        content: '设 $P(A) = 0.3$，$P(B) = 0.4$，$P(AB) = 0.1$，求 $P(A \\cup B)$。',
                                        solution: `**解：** 由加法公式：
$$P(A \\cup B) = P(A) + P(B) - P(AB)$$
$$= 0.3 + 0.4 - 0.1 = 0.6$$`
                                    }
                                ],
                                keyPoints: [
                                    '概率的值域是 $[0, 1]$',
                                    '对立事件 vs 互斥事件：对立必互斥，互斥不一定对立',
                                    '加法公式适用于任意两个事件',
                                    '减法公式：$P(A-B) = P(A) - P(AB)$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-1-2',
                            name: '条件概率与独立性',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**条件概率**：
在事件 $B$ 发生的条件下，事件 $A$ 发生的概率：
$$P(A|B) = \\frac{P(AB)}{P(B)}, \\quad P(B) > 0$$

**乘法公式**：
$$P(AB) = P(A)P(B|A) = P(B)P(A|B)$$

**全概率公式**：
若 $B_1, B_2, \\ldots, B_n$ 是样本空间的一个划分，则
$$P(A) = \\sum_{i=1}^n P(B_i)P(A|B_i)$$

**贝叶斯公式**：
$$P(B_j|A) = \\frac{P(B_j)P(A|B_j)}{\\sum_{i=1}^n P(B_i)P(A|B_i)}$$

**事件独立**：
$A$、$B$ 独立 $\\Leftrightarrow$ $P(AB) = P(A)P(B)$`,
                                formulas: [
                                    '$P(A|B) = \\dfrac{P(AB)}{P(B)}$',
                                    '$P(AB) = P(A)P(B|A)$',
                                    '$P(A) = \\sum_{i=1}^n P(B_i)P(A|B_i)$ （全概率）',
                                    '$P(B_j|A) = \\dfrac{P(B_j)P(A|B_j)}{P(A)}$ （贝叶斯）'
                                ],
                                examples: [
                                    {
                                        title: '例1：条件概率',
                                        content: '袋中有3红2白球，无放回取两次，第一次取到红球，求第二次也取到红球的概率。',
                                        solution: `**解：** 设 $A$ = "第一次红"，$B$ = "第二次红"

$P(B|A) = \\dfrac{P(AB)}{P(A)} = \\dfrac{\\frac{3}{5} \\times \\frac{2}{4}}{\\frac{3}{5}} = \\dfrac{2}{4} = \\dfrac{1}{2}$

或直接分析：第一次取红后，剩4球中有2红，故 $P(B|A) = \\dfrac{1}{2}$`
                                    }
                                ],
                                keyPoints: [
                                    '条件概率也满足概率的所有性质',
                                    '独立与互斥是不同的概念',
                                    '全概率公式是"由因求果"',
                                    '贝叶斯公式是"由果求因"'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-1-3',
                            name: '古典概型与几何概型',
                            difficulty: 'basic',
                            content: {
                                concept: `**古典概型**：
试验满足两个条件：
1. 样本空间只有有限个样本点
2. 每个样本点发生的可能性相等

概率计算公式：
$$P(A) = \\frac{A \\text{包含的样本点数}}{\\text{样本空间的样本点总数}} = \\frac{k}{n}$$

**常用计数方法**：
- 排列：$A_n^m = \\dfrac{n!}{(n-m)!}$
- 组合：$C_n^m = \\dfrac{n!}{m!(n-m)!}$

**几何概型**：
样本空间是一个可度量的区域 $\\Omega$，事件 $A$ 对应子区域 $G$：
$$P(A) = \\frac{G \\text{的度量}}{\\Omega \\text{的度量}}$$
度量可以是长度、面积或体积。`,
                                formulas: [
                                    '$P(A) = \\dfrac{k}{n}$ （古典概型）',
                                    '$C_n^m = \\dfrac{n!}{m!(n-m)!}$',
                                    '$P(A) = \\dfrac{|G|}{|\\Omega|}$ （几何概型）'
                                ],
                                examples: [
                                    {
                                        title: '例1：古典概型',
                                        content: '从1到10中随机取两个数，求它们之和为偶数的概率。',
                                        solution: `**解：** 样本空间大小：$C_{10}^2 = 45$

和为偶数的情况：
- 两个都是奇数：$C_5^2 = 10$
- 两个都是偶数：$C_5^2 = 10$

$$P = \\frac{10 + 10}{45} = \\frac{20}{45} = \\frac{4}{9}$$`
                                    },
                                    {
                                        title: '例2：几何概型（会面问题）',
                                        content: '甲乙约定在0到1小时内某地会面，先到者等15分钟后离去，求两人会面的概率。',
                                        solution: `**解：** 设甲、乙到达时间分别为 $x$、$y$（小时）

样本空间：$\\Omega = \\{(x,y): 0 \\leq x \\leq 1, 0 \\leq y \\leq 1\\}$
会面条件：$|x - y| \\leq 0.25$

$$P = 1 - \\frac{2 \\times (0.75)^2 / 2}{1} = 1 - 0.5625 = 0.4375 = \\frac{7}{16}$$`
                                    }
                                ],
                                keyPoints: [
                                    '古典概型要求等可能性',
                                    '排列考虑顺序，组合不考虑顺序',
                                    '几何概型用面积或体积计算概率',
                                    '注意样本空间的正确描述'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                {
                    id: 'prob-ch2',
                    name: '第二章 随机变量及其分布',
                    expanded: false,
                    units: [
                        {
                            id: 'prob-2-1',
                            name: '离散型随机变量',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**离散型随机变量**：
取值为有限个或可列个的随机变量。

**分布律**：$P(X = x_k) = p_k$，满足 $p_k \\geq 0$，$\\sum_k p_k = 1$

**常见离散分布**：

**1. 0-1分布**：$P(X=1) = p$，$P(X=0) = 1-p$

**2. 二项分布** $B(n, p)$：
$$P(X=k) = C_n^k p^k (1-p)^{n-k}, \\quad k = 0, 1, \\ldots, n$$

**3. 泊松分布** $P(\\lambda)$：
$$P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad k = 0, 1, 2, \\ldots$$

**4. 几何分布** $G(p)$：
$$P(X=k) = (1-p)^{k-1}p, \\quad k = 1, 2, \\ldots$$`,
                                formulas: [
                                    '$P(X=k) = C_n^k p^k (1-p)^{n-k}$ （二项分布）',
                                    '$P(X=k) = \\dfrac{\\lambda^k e^{-\\lambda}}{k!}$ （泊松分布）',
                                    '$E(X) = np$，$D(X) = np(1-p)$ （二项分布）',
                                    '$E(X) = D(X) = \\lambda$ （泊松分布）'
                                ],
                                examples: [
                                    {
                                        title: '例1：二项分布',
                                        content: '某产品合格率为0.9，检验10件，求恰好有8件合格的概率。',
                                        solution: `**解：** 设合格件数 $X \\sim B(10, 0.9)$

$$P(X=8) = C_{10}^8 (0.9)^8 (0.1)^2$$
$$= 45 \\times 0.9^8 \\times 0.01 \\approx 0.1937$$`
                                    }
                                ],
                                keyPoints: [
                                    '分布律的两个条件：非负性、归一性',
                                    '二项分布适用于n重伯努利试验',
                                    '泊松分布适用于稀有事件',
                                    '当n大p小时，二项分布可近似泊松分布'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-2-2',
                            name: '连续型随机变量',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**连续型随机变量**：
存在非负函数 $f(x)$，使得分布函数
$$F(x) = \\int_{-\\infty}^x f(t)dt$$
则 $f(x)$ 称为概率密度函数。

**概率密度的性质**：
1. $f(x) \\geq 0$
2. $\\int_{-\\infty}^{+\\infty} f(x)dx = 1$
3. $P(a < X \\leq b) = \\int_a^b f(x)dx$

**常见连续分布**：

**1. 均匀分布** $U(a, b)$：
$$f(x) = \\begin{cases} \\dfrac{1}{b-a}, & a < x < b \\\\ 0, & \\text{其他} \\end{cases}$$

**2. 指数分布** $E(\\lambda)$：
$$f(x) = \\begin{cases} \\lambda e^{-\\lambda x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}$$

**3. 正态分布** $N(\\mu, \\sigma^2)$：
$$f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$`,
                                formulas: [
                                    '$F(x) = \\int_{-\\infty}^x f(t)dt$',
                                    '$P(a < X \\leq b) = \\int_a^b f(x)dx$',
                                    '$E(X) = \\dfrac{a+b}{2}$，$D(X) = \\dfrac{(b-a)^2}{12}$ （均匀分布）',
                                    '$E(X) = \\mu$，$D(X) = \\sigma^2$ （正态分布）'
                                ],
                                examples: [
                                    {
                                        title: '例1：均匀分布',
                                        content: '设 $X \\sim U(0, 2)$，求 $P(0.5 < X < 1.5)$。',
                                        solution: `**解：** $f(x) = \\dfrac{1}{2}$（$0 < x < 2$）

$$P(0.5 < X < 1.5) = \\int_{0.5}^{1.5} \\frac{1}{2}dx = \\frac{1}{2} \\times 1 = 0.5$$`
                                    }
                                ],
                                keyPoints: [
                                    '连续型随机变量取单个值的概率为0',
                                    '概率密度可以大于1',
                                    '标准正态分布 $N(0, 1)$ 的分布函数记为 $\\Phi(x)$',
                                    '正态分布的标准化：$Z = \\dfrac{X - \\mu}{\\sigma}$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第三章 数字特征
                {
                    id: 'prob-ch3',
                    name: '第三章 随机变量的数字特征',
                    expanded: false,
                    units: [
                        {
                            id: 'prob-3-1',
                            name: '期望与方差',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**数学期望**：
- 离散型：$E(X) = \\sum_k x_k p_k$
- 连续型：$E(X) = \\int_{-\\infty}^{+\\infty} xf(x)dx$

**期望的性质**：
1. $E(C) = C$
2. $E(CX) = CE(X)$
3. $E(X + Y) = E(X) + E(Y)$
4. 若 $X$、$Y$ 独立，则 $E(XY) = E(X)E(Y)$

**方差**：
$$D(X) = E[(X - E(X))^2] = E(X^2) - [E(X)]^2$$

**方差的性质**：
1. $D(C) = 0$
2. $D(CX) = C^2 D(X)$
3. $D(X + Y) = D(X) + D(Y) + 2\\text{Cov}(X, Y)$
4. 若 $X$、$Y$ 独立，则 $D(X + Y) = D(X) + D(Y)$`,
                                formulas: [
                                    '$E(X) = \\sum_k x_k p_k$ （离散型）',
                                    '$D(X) = E(X^2) - [E(X)]^2$',
                                    '$D(CX) = C^2 D(X)$',
                                    '$\\sigma(X) = \\sqrt{D(X)}$ （标准差）'
                                ],
                                examples: [
                                    {
                                        title: '例1：计算期望和方差',
                                        content: '设 $X$ 的分布律为 $P(X=0)=0.3$，$P(X=1)=0.5$，$P(X=2)=0.2$，求 $E(X)$ 和 $D(X)$。',
                                        solution: `**解：**
$$E(X) = 0×0.3 + 1×0.5 + 2×0.2 = 0.9$$

$$E(X^2) = 0^2×0.3 + 1^2×0.5 + 2^2×0.2 = 1.3$$

$$D(X) = E(X^2) - [E(X)]^2 = 1.3 - 0.81 = 0.49$$`
                                    }
                                ],
                                keyPoints: [
                                    '期望是随机变量的"平均值"',
                                    '方差衡量随机变量的离散程度',
                                    '计算方差常用公式 $D(X) = E(X^2) - [E(X)]^2$',
                                    '切比雪夫不等式：$P(|X-\\mu| \\geq \\varepsilon) \\leq \\dfrac{\\sigma^2}{\\varepsilon^2}$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-3-2',
                            name: '协方差与相关系数',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**协方差**：
$$\\text{Cov}(X, Y) = E[(X - E(X))(Y - E(Y))] = E(XY) - E(X)E(Y)$$

**协方差的性质**：
1. $\\text{Cov}(X, X) = D(X)$
2. $\\text{Cov}(X, Y) = \\text{Cov}(Y, X)$
3. $\\text{Cov}(aX, bY) = ab\\text{Cov}(X, Y)$
4. $\\text{Cov}(X_1 + X_2, Y) = \\text{Cov}(X_1, Y) + \\text{Cov}(X_2, Y)$

**相关系数**：
$$\\rho_{XY} = \\frac{\\text{Cov}(X, Y)}{\\sqrt{D(X)}\\sqrt{D(Y)}}$$

**性质**：
- $|\\rho| \\leq 1$
- $|\\rho| = 1$ $\\Leftrightarrow$ $X$ 与 $Y$ 线性相关
- $\\rho = 0$ 表示不相关（但不一定独立）`,
                                formulas: [
                                    '$\\text{Cov}(X, Y) = E(XY) - E(X)E(Y)$',
                                    '$\\rho_{XY} = \\dfrac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$',
                                    '$D(X \\pm Y) = D(X) + D(Y) \\pm 2\\text{Cov}(X, Y)$'
                                ],
                                examples: [
                                    {
                                        title: '例1：计算协方差',
                                        content: '设 $E(X) = 1$，$E(Y) = 2$，$E(XY) = 3$，求 $\\text{Cov}(X, Y)$。',
                                        solution: `**解：**
$$\\text{Cov}(X, Y) = E(XY) - E(X)E(Y) = 3 - 1 \\times 2 = 1$$`
                                    }
                                ],
                                keyPoints: [
                                    '独立 $\\Rightarrow$ 不相关，但反之不成立',
                                    '对于二维正态分布，不相关等价于独立',
                                    '协方差为0表示无线性关系',
                                    '$\\rho > 0$ 正相关，$\\rho < 0$ 负相关'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第四章 多维随机变量
                {
                    id: 'prob-ch4',
                    name: '第四章 多维随机变量',
                    expanded: false,
                    units: [
                        {
                            id: 'prob-4-1',
                            name: '二维随机变量及其分布',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**联合分布函数**：
$$F(x, y) = P(X \\leq x, Y \\leq y)$$

**离散型联合分布**：
$$P(X = x_i, Y = y_j) = p_{ij}$$
满足 $\\sum_i \\sum_j p_{ij} = 1$

**连续型联合分布**：
$$F(x, y) = \\int_{-\\infty}^x \\int_{-\\infty}^y f(s, t) dt ds$$
其中 $f(x, y)$ 是联合密度函数，满足：
- $f(x, y) \\geq 0$
- $\\iint_{-\\infty}^{+\\infty} f(x, y) dx dy = 1$

**常见二维分布**：
二维正态分布 $N(\\mu_1, \\mu_2, \\sigma_1^2, \\sigma_2^2, \\rho)$`,
                                formulas: [
                                    '$F(x, y) = P(X \\leq x, Y \\leq y)$',
                                    '$P(a < X \\leq b, c < Y \\leq d) = F(b,d) - F(a,d) - F(b,c) + F(a,c)$',
                                    '$f(x, y) = \\dfrac{\\partial^2 F}{\\partial x \\partial y}$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求概率',
                                        content: '设 $(X, Y)$ 的联合密度 $f(x,y) = 2$（$0 < x < y < 1$），求 $P(X + Y < 1)$。',
                                        solution: `**解：** 积分区域：$0 < x < y < 1$ 且 $x + y < 1$
$$P(X + Y < 1) = \\iint_D 2 dx dy$$
$$= \\int_0^{1/2} dx \\int_x^{1-x} 2 dy = \\int_0^{1/2} 2(1-2x) dx$$
$$= [2x - 2x^2]_0^{1/2} = 1 - \\frac{1}{2} = \\frac{1}{2}$$`
                                    }
                                ],
                                keyPoints: [
                                    '联合分布确定边缘分布，反之不成立',
                                    '连续型求概率要确定积分区域',
                                    '二维正态的参数包括两个均值、两个方差和相关系数',
                                    '联合密度在边界上的值对概率无影响'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-4-2',
                            name: '边缘分布与独立性',
                            difficulty: 'intermediate',
                            content: {
                                concept: `**边缘分布函数**：
$$F_X(x) = F(x, +\\infty), \\quad F_Y(y) = F(+\\infty, y)$$

**边缘密度函数**：
$$f_X(x) = \\int_{-\\infty}^{+\\infty} f(x, y) dy$$
$$f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x, y) dx$$

**边缘分布律**：
$$p_{i\\cdot} = \\sum_j p_{ij}, \\quad p_{\\cdot j} = \\sum_i p_{ij}$$

**独立性**：
$X$ 与 $Y$ 独立 $\\Leftrightarrow$ $F(x, y) = F_X(x) F_Y(y)$
$\\Leftrightarrow$ $f(x, y) = f_X(x) f_Y(y)$
$\\Leftrightarrow$ $p_{ij} = p_{i\\cdot} p_{\\cdot j}$（对所有 $i, j$）`,
                                formulas: [
                                    '$f_X(x) = \\int_{-\\infty}^{+\\infty} f(x, y) dy$',
                                    '$f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x, y) dx$',
                                    '独立 $\\Leftrightarrow$ $f(x, y) = f_X(x) f_Y(y)$'
                                ],
                                examples: [
                                    {
                                        title: '例1：求边缘密度',
                                        content: '设 $f(x,y) = 2$（$0 < x < y < 1$），求 $f_X(x)$。',
                                        solution: `**解：** 对于 $0 < x < 1$：
$$f_X(x) = \\int_x^1 2 dy = 2(1-x)$$

因此 $f_X(x) = \\begin{cases} 2(1-x), & 0 < x < 1 \\\\ 0, & \\text{其他} \\end{cases}$`
                                    }
                                ],
                                keyPoints: [
                                    '边缘分布丢失了变量间的依赖信息',
                                    '判断独立性要检验所有点',
                                    '独立时联合分布可分解为边缘分布的乘积',
                                    '二维正态中 $\\rho = 0$ 等价于独立'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-4-3',
                            name: '条件分布与随机变量函数',
                            difficulty: 'advanced',
                            content: {
                                concept: `**条件分布**：
$$f_{X|Y}(x|y) = \\frac{f(x, y)}{f_Y(y)}, \\quad f_Y(y) > 0$$

**全概率公式的连续形式**：
$$f_X(x) = \\int_{-\\infty}^{+\\infty} f_{X|Y}(x|y) f_Y(y) dy$$

**随机变量函数的分布**：
设 $Z = g(X, Y)$，求 $Z$ 的分布：
1. 分布函数法：$F_Z(z) = P(g(X,Y) \\leq z)$
2. 公式法（特殊情形）

**$Z = X + Y$ 的卷积公式**：
$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z-x) dx$$
（$X$、$Y$ 独立时）`,
                                formulas: [
                                    '$f_{X|Y}(x|y) = \\dfrac{f(x, y)}{f_Y(y)}$',
                                    '$f_{X+Y}(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z-x) dx$ （卷积）',
                                    '$F_Z(z) = P(g(X,Y) \\leq z)$ （分布函数法）'
                                ],
                                examples: [
                                    {
                                        title: '例1：求和的分布',
                                        content: '设 $X \\sim U(0,1)$，$Y \\sim U(0,1)$ 独立，求 $Z = X + Y$ 的密度。',
                                        solution: `**解：** 用卷积公式：
$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z-x) dx$$

当 $0 < z < 1$：$f_Z(z) = \\int_0^z 1 dx = z$
当 $1 < z < 2$：$f_Z(z) = \\int_{z-1}^1 1 dx = 2-z$

$$f_Z(z) = \\begin{cases} z, & 0 < z < 1 \\\\ 2-z, & 1 \\leq z < 2 \\\\ 0, & \\text{其他} \\end{cases}$$`
                                    }
                                ],
                                keyPoints: [
                                    '条件密度除以边缘密度',
                                    '独立同分布的和用卷积公式',
                                    '正态分布的线性组合仍是正态',
                                    '$\\max$ 和 $\\min$ 函数用分布函数法'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第五章 大数定律与中心极限定理
                {
                    id: 'prob-ch5',
                    name: '第五章 大数定律与中心极限定理',
                    expanded: false,
                    units: [
                        {
                            id: 'prob-5-1',
                            name: '大数定律',
                            difficulty: 'advanced',
                            content: {
                                concept: `**切比雪夫不等式**：
$$P(|X - \\mu| \\geq \\varepsilon) \\leq \\frac{\\sigma^2}{\\varepsilon^2}$$

**切比雪夫大数定律**：
设 $X_1, X_2, \\ldots$ 两两不相关，期望为 $\\mu_i$，方差存在且一致有界，则
$$\\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\frac{1}{n}\\sum_{i=1}^n \\mu_i$$

**辛钦大数定律**：
设 $X_1, X_2, \\ldots$ 独立同分布，期望为 $\\mu$，则
$$\\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\mu$$

**伯努利大数定律**：
设 $n_A$ 是 $n$ 次独立试验中事件 $A$ 发生的次数，$P(A) = p$，则
$$\\frac{n_A}{n} \\xrightarrow{P} p$$`,
                                formulas: [
                                    '$P(|X - \\mu| \\geq \\varepsilon) \\leq \\dfrac{\\sigma^2}{\\varepsilon^2}$ （切比雪夫）',
                                    '$\\bar{X}_n \\xrightarrow{P} \\mu$ （辛钦）',
                                    '$\\dfrac{n_A}{n} \\xrightarrow{P} p$ （伯努利）'
                                ],
                                examples: [
                                    {
                                        title: '例1：应用切比雪夫不等式',
                                        content: '设 $X \\sim N(0, 1)$，用切比雪夫不等式估计 $P(|X| \\geq 2)$。',
                                        solution: `**解：** $\\mu = 0$，$\\sigma^2 = 1$，$\\varepsilon = 2$
$$P(|X - 0| \\geq 2) \\leq \\frac{1}{4} = 0.25$$

（实际值 $P(|X| \\geq 2) = 2(1 - \\Phi(2)) \\approx 0.046$，估计较粗糙）`
                                    }
                                ],
                                keyPoints: [
                                    '大数定律说明样本均值收敛于总体均值',
                                    '这是频率稳定于概率的理论基础',
                                    '切比雪夫不等式给出概率的上界估计',
                                    '依概率收敛不是处处收敛'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-5-2',
                            name: '中心极限定理',
                            difficulty: 'advanced',
                            content: {
                                concept: `**独立同分布中心极限定理（林德伯格-列维）**：
设 $X_1, X_2, \\ldots$ 独立同分布，$E(X_i) = \\mu$，$D(X_i) = \\sigma^2 > 0$，则
$$\\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0, 1)$$
或等价地
$$\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\xrightarrow{d} N(0, 1)$$

**棣莫弗-拉普拉斯定理**：
设 $n_A \\sim B(n, p)$，则
$$\\frac{n_A - np}{\\sqrt{np(1-p)}} \\xrightarrow{d} N(0, 1)$$

**应用**：
当 $n$ 充分大时，$\\bar{X} \\approx N(\\mu, \\sigma^2/n)$`,
                                formulas: [
                                    '$\\dfrac{\\sum X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0, 1)$',
                                    '$\\bar{X} \\approx N(\\mu, \\sigma^2/n)$ （近似）',
                                    '$n_A \\approx N(np, np(1-p))$ （二项分布近似）'
                                ],
                                examples: [
                                    {
                                        title: '例1：中心极限定理应用',
                                        content: '设 $X_1, \\ldots, X_{100}$ 独立同分布，$E(X_i) = 2$，$D(X_i) = 4$，求 $P(\\sum X_i > 220)$。',
                                        solution: `**解：** $n = 100$，$\\mu = 2$，$\\sigma^2 = 4$
$$E(\\sum X_i) = 200, \\quad D(\\sum X_i) = 400$$

$$P(\\sum X_i > 220) = P\\left(\\frac{\\sum X_i - 200}{20} > 1\\right)$$
$$\\approx 1 - \\Phi(1) \\approx 1 - 0.8413 = 0.1587$$`
                                    }
                                ],
                                keyPoints: [
                                    '中心极限定理说明大量独立随机变量之和近似正态',
                                    '这是正态分布广泛应用的理论基础',
                                    '一般 $n \\geq 30$ 时近似效果较好',
                                    '二项分布可用正态近似（需连续性修正）'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                },
                // 第六章 数理统计基础
                {
                    id: 'prob-ch6',
                    name: '第六章 数理统计基础',
                    expanded: false,
                    units: [
                        {
                            id: 'prob-6-1',
                            name: '统计量与抽样分布',
                            difficulty: 'advanced',
                            content: {
                                concept: `**统计量**：
样本 $X_1, \\ldots, X_n$ 的函数（不含未知参数）。

**常用统计量**：
- 样本均值：$\\bar{X} = \\dfrac{1}{n}\\sum_{i=1}^n X_i$
- 样本方差：$S^2 = \\dfrac{1}{n-1}\\sum_{i=1}^n (X_i - \\bar{X})^2$
- 样本标准差：$S = \\sqrt{S^2}$

**三大分布**：
1. **$\\chi^2$ 分布**：$\\chi^2 = \\sum_{i=1}^n X_i^2$（$X_i \\sim N(0,1)$ 独立）
2. **$t$ 分布**：$t = \\dfrac{X}{\\sqrt{Y/n}}$（$X \\sim N(0,1)$，$Y \\sim \\chi^2(n)$ 独立）
3. **$F$ 分布**：$F = \\dfrac{U/n_1}{V/n_2}$（$U \\sim \\chi^2(n_1)$，$V \\sim \\chi^2(n_2)$ 独立）`,
                                formulas: [
                                    '$E(\\bar{X}) = \\mu$，$D(\\bar{X}) = \\sigma^2/n$',
                                    '$E(S^2) = \\sigma^2$',
                                    '$\\dfrac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)$'
                                ],
                                examples: [
                                    {
                                        title: '例1：抽样分布',
                                        content: '设 $X_1, \\ldots, X_n$ 来自 $N(\\mu, \\sigma^2)$，求 $\\bar{X}$ 的分布。',
                                        solution: `**解：** 正态总体的样本均值：
$$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

标准化后：
$$\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\sim N(0, 1)$$`
                                    }
                                ],
                                keyPoints: [
                                    '样本方差用 $n-1$ 是为了无偏性',
                                    '$\\bar{X}$ 与 $S^2$ 独立（正态总体）',
                                    '$t$ 分布在 $n \\to \\infty$ 时趋近标准正态',
                                    '$\\chi^2(n)$ 的期望为 $n$，方差为 $2n$'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-6-2',
                            name: '参数估计',
                            difficulty: 'advanced',
                            content: {
                                concept: `**点估计方法**：

**1. 矩估计法**：
用样本矩替代总体矩，建立方程求解参数。
- $\\bar{X} = E(X)$
- $\\dfrac{1}{n}\\sum X_i^2 = E(X^2)$

**2. 最大似然估计（MLE）**：
似然函数：$L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$
取对数后求导令其为0：$\\dfrac{d \\ln L}{d\\theta} = 0$

**估计量的评价标准**：
1. **无偏性**：$E(\\hat{\\theta}) = \\theta$
2. **有效性**：方差小
3. **一致性**：$\\hat{\\theta} \\xrightarrow{P} \\theta$`,
                                formulas: [
                                    '$\\bar{X} = E(X)$ （一阶矩方程）',
                                    '$L(\\theta) = \\prod f(x_i; \\theta)$',
                                    '$\\dfrac{\\partial \\ln L}{\\partial \\theta} = 0$ （似然方程）'
                                ],
                                examples: [
                                    {
                                        title: '例1：最大似然估计',
                                        content: '设 $X \\sim P(\\lambda)$（泊松分布），求 $\\lambda$ 的MLE。',
                                        solution: `**解：** 似然函数：
$$L(\\lambda) = \\prod_{i=1}^n \\frac{\\lambda^{x_i} e^{-\\lambda}}{x_i!}$$

取对数：
$$\\ln L = \\sum x_i \\ln\\lambda - n\\lambda - \\sum \\ln(x_i!)$$

令 $\\dfrac{d\\ln L}{d\\lambda} = \\dfrac{\\sum x_i}{\\lambda} - n = 0$

得 $\\hat{\\lambda} = \\bar{X}$`
                                    }
                                ],
                                keyPoints: [
                                    '矩估计简单但不一定最优',
                                    'MLE 在大样本下具有良好性质',
                                    '$\\bar{X}$ 是 $\\mu$ 的无偏估计',
                                    '$S^2$ 是 $\\sigma^2$ 的无偏估计'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        },
                        {
                            id: 'prob-6-3',
                            name: '区间估计与假设检验',
                            difficulty: 'advanced',
                            content: {
                                concept: `**区间估计**：
构造随机区间 $(\\hat{\\theta}_L, \\hat{\\theta}_U)$ 使得
$$P(\\hat{\\theta}_L < \\theta < \\hat{\\theta}_U) = 1 - \\alpha$$
$1 - \\alpha$ 称为置信水平。

**正态总体均值的置信区间**：
- $\\sigma$ 已知：$\\bar{X} \\pm z_{\\alpha/2} \\cdot \\dfrac{\\sigma}{\\sqrt{n}}$
- $\\sigma$ 未知：$\\bar{X} \\pm t_{\\alpha/2}(n-1) \\cdot \\dfrac{S}{\\sqrt{n}}$

**假设检验**：
1. 建立原假设 $H_0$ 和备择假设 $H_1$
2. 选择检验统计量
3. 确定拒绝域
4. 计算统计量值，做出判断

**两类错误**：
- 第一类错误（弃真）：$P(\\text{拒绝}H_0 | H_0\\text{真}) = \\alpha$
- 第二类错误（取伪）：$P(\\text{接受}H_0 | H_0\\text{假}) = \\beta$`,
                                formulas: [
                                    '$\\bar{X} \\pm z_{\\alpha/2} \\cdot \\dfrac{\\sigma}{\\sqrt{n}}$ （$\\sigma$ 已知）',
                                    '$\\bar{X} \\pm t_{\\alpha/2}(n-1) \\cdot \\dfrac{S}{\\sqrt{n}}$ （$\\sigma$ 未知）'
                                ],
                                examples: [
                                    {
                                        title: '例1：求置信区间',
                                        content: '设 $X \\sim N(\\mu, 4)$，样本均值 $\\bar{x} = 10$，$n = 16$，求 $\\mu$ 的 $95\\%$ 置信区间。',
                                        solution: `**解：** $\\sigma = 2$ 已知，$z_{0.025} = 1.96$

置信区间：$\\bar{x} \\pm z_{0.025} \\cdot \\dfrac{\\sigma}{\\sqrt{n}}$
$$= 10 \\pm 1.96 \\times \\frac{2}{4} = 10 \\pm 0.98$$
$$= (9.02, 10.98)$$`
                                    }
                                ],
                                keyPoints: [
                                    '置信水平越高，区间越宽',
                                    '样本量越大，区间越窄',
                                    '$\\alpha$ 称为显著性水平',
                                    '控制 $\\alpha$ 时 $\\beta$ 可能增大'
                                ]
                            },
                            aiEnhanced: null,
                            relatedProblems: []
                        }
                    ]
                }
            ]
        }
    };
}

// 辅助函数

/**
 * 获取状态图标
 * @param {string} status - 状态
 * @returns {string} - 图标
 */
function getStatusIcon(status) {
    const icons = {
        'not-started': '🔴',
        'learning': '🟡',
        'completed': '🟢',
        'mastered': '⭐'
    };
    return icons[status] || '🔴';
}

/**
 * 获取状态文本
 * @param {string} status - 状态
 * @returns {string} - 文本
 */
function getStatusText(status) {
    const texts = {
        'not-started': '未开始',
        'learning': '学习中',
        'completed': '已完成',
        'mastered': '已掌握'
    };
    return texts[status] || '未开始';
}

/**
 * 获取难度文本
 * @param {string} difficulty - 难度
 * @returns {string} - 文本
 */
function getDifficultyText(difficulty) {
    const texts = {
        'basic': '基础',
        'intermediate': '中等',
        'advanced': '进阶'
    };
    return texts[difficulty] || '基础';
}

/**
 * 计算学科进度
 * @param {Object} subject - 学科对象
 * @param {Object} progress - 进度数据
 * @returns {number} - 进度百分比
 */
function calculateSubjectProgress(subject, progress) {
    let total = 0;
    let completed = 0;

    subject.chapters.forEach(chapter => {
        chapter.units.forEach(unit => {
            total++;
            const status = progress[unit.id]?.status;
            if (status === 'completed' || status === 'mastered') {
                completed++;
            }
        });
    });

    return total > 0 ? Math.round(completed / total * 100) : 0;
}
