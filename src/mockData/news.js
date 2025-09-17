// 新闻相关模拟数据

// 生成随机ID
function generateNewsId() {
  return 'news_' + Math.random().toString(36).substr(2, 9);
}

// 生成随机日期
function generateRandomDate(days = 30) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()));
}

// 生成新闻标题
function generateNewsTitle(type) {
  const titles = {
    market: [
      '上证指数突破3500点，创年内新高',
      '创业板指大幅震荡，科技股表现分化',
      '央行降准0.5个百分点，释放长期资金约1万亿元',
      '美联储宣布维持利率不变，年内或有加息可能',
      '全球市场波动加剧，避险资产受到青睐',
      '国内经济数据向好，市场信心提振',
      '新能源板块持续走强，多只个股涨停',
      '金融板块集体拉升，银行股领涨',
      '医药板块迎来政策利好，估值修复可期',
      '消费板块回暖，龙头股业绩超预期'
    ],
    fund: [
      '多只权益基金净值创新高，基金经理看好后市',
      '公募基金规模突破25万亿元，创新历史新高',
      'ETF市场持续扩容，投资者关注度提升',
      '基金分红热情高涨，年内分红金额已超千亿',
      '养老目标基金规模稳步增长，投资者认可度提高',
      'QDII基金表现亮眼，海外配置需求增加',
      '债券基金受青睐，避险资金持续流入',
      '指数基金成为投资者配置工具首选',
      '基金经理变动频繁，投资者需关注产品稳定性',
      '新基金发行市场回暖，权益类产品占比提升'
    ],
    company: [
      '公司年度业绩发布会即将召开，投资者可在线参与',
      '公司荣获"年度最佳基金公司"称号',
      '公司推出全新养老理财产品，满足多样化需求',
      '公司宣布管理层变更，新任总经理将上任',
      '公司完成战略融资，估值超百亿元',
      '公司与多家金融机构达成战略合作',
      '公司获得基金销售牌照，业务范围进一步扩大',
      '公司推出投资者教育系列活动',
      '公司信息系统升级完成，服务体验全面提升',
      '公司发布社会责任报告，积极践行ESG理念'
    ],
    strategy: [
      '2023年下半年投资策略：把握结构性机会',
      '科技板块投资机会分析：关注这三大方向',
      '消费复苏背景下的投资策略：从必选到可选',
      '如何构建适合自己的基金投资组合',
      '震荡市中的投资策略：控制仓位，精选个股',
      '长期投资的魅力：时间是最好的朋友',
      '分散投资的重要性：不要把鸡蛋放在一个篮子里',
      '基金定投策略：如何提高收益概率',
      '价值投资与成长投资：如何平衡配置',
      '不同市场环境下的资产配置策略'
    ]
  };
  
  const typeTitles = titles[type] || titles.market;
  return typeTitles[Math.floor(Math.random() * typeTitles.length)];
}

// 生成新闻内容
function generateNewsContent() {
  const paragraphs = [
    '近期市场表现活跃，投资者情绪逐渐回暖。业内专家表示，随着经济基本面的持续改善和政策面的积极支持，市场有望保持稳定上行趋势。',
    '从行业板块来看，科技、新能源、医药等领域表现突出，成为市场关注的焦点。多家基金公司纷纷布局相关主题基金，以把握行业发展机遇。',
    '对于普通投资者而言，当前市场环境下，建议采取分散投资策略，合理配置各类资产，避免过度集中于单一板块。同时，应保持长期投资的心态，避免频繁交易。',
    '值得注意的是，市场波动仍将存在，投资者需密切关注宏观经济变化和政策动向，及时调整投资策略。专业机构的研究报告显示，未来市场有望呈现结构性机会，精选优质标的至关重要。',
    '在基金选择方面，投资者应综合考虑基金经理的投资能力、基金公司的整体实力、基金产品的历史业绩以及风险控制能力等因素，选择适合自己风险偏好的产品。'
  ];
  
  const contentLength = Math.floor(Math.random() * 3) + 2; // 2-4个段落
  let content = '';
  
  for (let i = 0; i < contentLength; i++) {
    const paragraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    content += `<p>${paragraph}</p>`;
  }
  
  return content;
}

// 生成新闻来源
function generateNewsSource() {
  const sources = ['中国证券报', '上海证券报', '证券时报', '证券日报', '财经网', '新浪财经', '腾讯财经', '网易财经', '公司公告', '研究报告'];
  return sources[Math.floor(Math.random() * sources.length)];
}

// 生成模拟新闻数据
export function generateNews(count = 50) {
  const newsList = [];
  const types = ['market', 'fund', 'company', 'strategy'];
  const categories = ['宏观经济', '行业动态', '公司公告', '投资策略', '基金资讯', '市场分析'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isTop = Math.random() > 0.8; // 20%的概率置顶
    const isHot = Math.random() > 0.7; // 30%的概率热门
    const viewCount = Math.floor(Math.random() * 10000); // 0-10000次阅读
    const commentCount = Math.floor(Math.random() * 100); // 0-100条评论
    
    const news = {
      id: generateNewsId(),
      title: generateNewsTitle(type),
      content: generateNewsContent(),
      type,
      category,
      source: generateNewsSource(),
      publishDate: generateRandomDate(180).toISOString(), // 过去6个月内
      lastUpdateDate: generateRandomDate(30).toISOString(), // 过去30天内
      author: '财经编辑',
      viewCount,
      commentCount,
      shareCount: Math.floor(Math.random() * 500), // 0-500次分享
      isTop,
      isHot,
      tags: getNewsTags(category),
      coverImage: isTop || isHot ? `https://picsum.photos/800/450?random=${i}` : null
    };
    
    newsList.push(news);
  }
  
  // 按发布日期排序
  newsList.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  
  return newsList;
}

// 获取新闻标签
function getNewsTags(category) {
  const tagsMap = {
    '宏观经济': ['经济数据', '政策解读', '央行动态', '财政政策', '货币政策'],
    '行业动态': ['科技', '新能源', '医药', '消费', '金融', '地产', '制造业'],
    '公司公告': ['业绩预告', '人事变动', '战略合作', '产品发布', '重大事项'],
    '投资策略': ['资产配置', '选股思路', '市场展望', '风险控制', '投资技巧'],
    '基金资讯': ['基金发行', '基金分红', '基金经理变动', '基金排名', '费率调整'],
    '市场分析': ['技术分析', '基本面分析', '量化分析', '情绪分析', '国际市场']
  };
  
  const tags = tagsMap[category] || ['市场动态', '投资'];
  const randomTags = [];
  const tagCount = Math.floor(Math.random() * 3) + 1; // 1-3个标签
  
  // 随机选择标签，避免重复
  const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(tagCount, shuffledTags.length); i++) {
    randomTags.push(shuffledTags[i]);
  }
  
  return randomTags;
}

// 生成模拟公告数据
function generateAnnouncements(count = 20) {
  const announcements = [];
  const announcementTypes = ['系统公告', '业务调整', '活动通知', '风险提示', '重要提示'];
  
  for (let i = 0; i < count; i++) {
    const type = announcementTypes[Math.floor(Math.random() * announcementTypes.length)];
    const isUrgent = Math.random() > 0.8; // 20%的概率紧急
    
    let title = '';
    switch (type) {
      case '系统公告':
        title = `关于系统${isUrgent ? '紧急' : ''}维护的通知`;
        break;
      case '业务调整':
        title = '关于调整部分基金申购赎回规则的公告';
        break;
      case '活动通知':
        title = '新用户注册优惠活动即将开始';
        break;
      case '风险提示':
        title = '关于市场波动风险的提示';
        break;
      case '重要提示':
        title = '关于2023年节假日休市安排的通知';
        break;
    }
    
    announcements.push({
      id: `announcement_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content: generateNewsContent(),
      type,
      publishDate: generateRandomDate(90).toISOString(), // 过去3个月内
      isUrgent,
      isSticky: Math.random() > 0.8, // 20%的概率置顶
      author: '平台管理员'
    });
  }
  
  // 按发布日期排序，置顶的排在前面
  announcements.sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    return new Date(b.publishDate) - new Date(a.publishDate);
  });
  
  return announcements;
}

// 生成模拟评论数据
function generateComments(newsId, count = 10) {
  const comments = [];
  const usernames = ['投资达人', '基金爱好者', '财务自由追求者', '理财小白', '价值投资者', '成长股猎手', '稳健型选手', '长期持有'];
  const commentContents = [
    '分析得很到位，学到了很多。',
    '感谢分享，对我很有帮助。',
    '有不同观点，我认为市场可能还有调整空间。',
    '请问专家怎么看当前的市场走势？',
    '非常实用的投资建议，已经开始实践了。',
    '期待更多这样的优质内容。',
    '数据很详实，分析很专业。',
    '对于新手来说，这篇文章非常友好。',
    '希望能多分享一些具体的投资案例。',
    '观点独特，给了我新的思考角度。'
  ];
  
  for (let i = 0; i < count; i++) {
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const content = commentContents[Math.floor(Math.random() * commentContents.length)];
    const likeCount = Math.floor(Math.random() * 50); // 0-50个赞
    const replyCount = Math.floor(Math.random() * 10); // 0-10条回复
    
    comments.push({
      id: `comment_${Math.random().toString(36).substr(2, 9)}`,
      newsId,
      username,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2, 10)}`,
      content,
      publishDate: generateRandomDate(15).toISOString(), // 过去15天内
      likeCount,
      replyCount,
      isTop: Math.random() > 0.9 // 10%的概率置顶
    });
  }
  
  // 按点赞数和发布日期排序
  comments.sort((a, b) => {
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    if (a.likeCount !== b.likeCount) return b.likeCount - a.likeCount;
    return new Date(b.publishDate) - new Date(a.publishDate);
  });
  
  return comments;
}

// 生成模拟新闻数据
export const mockNews = generateNews();
export const mockAnnouncements = generateAnnouncements();

// 获取新闻详情
export function getNewsDetail(newsId) {
  const news = mockNews.find(n => n.id === newsId);
  if (!news) return null;
  
  return {
    ...news,
    comments: generateComments(newsId)
  };
}

// 分页获取新闻列表
export function getNewsPaged(page = 1, pageSize = 10, keyword = '', filters = {}) {
  let results = [...mockNews];
  
  // 关键词搜索
  if (keyword && keyword.trim()) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(news => 
      news.title.toLowerCase().includes(lowerKeyword) ||
      news.content.toLowerCase().includes(lowerKeyword) ||
      news.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }
  
  // 类型筛选
  if (filters.type && filters.type !== 'all') {
    results = results.filter(news => news.type === filters.type);
  }
  
  // 分类筛选
  if (filters.category && filters.category !== 'all') {
    results = results.filter(news => news.category === filters.category);
  }
  
  // 标签筛选
  if (filters.tag && filters.tag !== 'all') {
    results = results.filter(news => news.tags.includes(filters.tag));
  }
  
  // 置顶优先，然后按发布日期排序
  results.sort((a, b) => {
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    return new Date(b.publishDate) - new Date(a.publishDate);
  });
  
  // 分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  return {
    data: paginatedResults,
    total: results.length,
    page,
    pageSize,
    totalPages: Math.ceil(results.length / pageSize)
  };
}

// 获取热门新闻
export function getHotNews(count = 10) {
  const hotNews = mockNews
    .filter(news => news.isHot || news.viewCount > 5000)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, count);
  
  return hotNews;
}

// 获取置顶新闻
export function getTopNews() {
  return mockNews.filter(news => news.isTop).sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
}

// 分页获取公告列表
export function getAnnouncementsPaged(page = 1, pageSize = 10, keyword = '', filters = {}) {
  let results = [...mockAnnouncements];
  
  // 关键词搜索
  if (keyword && keyword.trim()) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(announcement => 
      announcement.title.toLowerCase().includes(lowerKeyword) ||
      announcement.content.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 类型筛选
  if (filters.type && filters.type !== 'all') {
    results = results.filter(announcement => announcement.type === filters.type);
  }
  
  // 紧急筛选
  if (filters.isUrgent && filters.isUrgent !== 'all') {
    results = results.filter(announcement => announcement.isUrgent === (filters.isUrgent === 'true'));
  }
  
  // 分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  return {
    data: paginatedResults,
    total: results.length,
    page,
    pageSize,
    totalPages: Math.ceil(results.length / pageSize)
  };
}