import { ChangeEvent, Dispatch, FormEvent, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  Eye,
  ImagePlus,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { deleteCase, fetchAdminCase, fetchAdminCases, fetchCase, fetchCases, saveCase, uploadImage } from "./api";
import { brand, caseCategories, demoCases, methods, services, strategyPillars } from "./content";
import type { BrandCase, CaseSummary } from "./types";

const emptyCase: Partial<BrandCase> = {
  title: "",
  client: "",
  category: "品牌内容",
  industry: "",
  serviceType: "视频内容策划",
  summary: "",
  coverImage: "",
  gallery: [],
  challenge: "",
  solution: "",
  results: [],
  highlights: [],
  videoUrl: "",
  status: "published",
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [wechatOpen, setWechatOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (href: string) => {
    window.history.pushState(null, "", href);
    setPath(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {path.startsWith("/admin") ? (
        <AdminPage navigate={navigate} />
      ) : path.startsWith("/cases/") ? (
        <CaseDetailPage id={decodeURIComponent(path.replace("/cases/", ""))} navigate={navigate} />
      ) : (
        <HomePage navigate={navigate} />
      )}
      <button className="wechat-float" type="button" onClick={() => setWechatOpen(true)} aria-label="微信咨询">
        <MessageCircle size={22} />
        微信咨询
      </button>
      {wechatOpen && <WechatModal onClose={() => setWechatOpen(false)} />}
    </>
  );
}

function HomePage({ navigate }: { navigate: (href: string) => void }) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const proofItems = buildProofItems(cases);
  const heroMetric = buildHeroMetric(cases);

  useEffect(() => {
    fetchCases()
      .then((data) => setCases(mergeWithDemoCases(data.cases, "published")))
      .catch(() => setCases(demoCases))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Header navigate={navigate} />
      <section className="hero">
        <div className="hero__content">
          <div className="eyebrow">
            <Sparkles size={16} />
            品牌策略 × 视觉系统 × 内容增长
          </div>
          <h1>{brand.tagline}</h1>
          <p>{brand.promise}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#cases">
              看案例
              <ArrowRight size={18} />
            </a>
            <a className="button button--ghost" href="#services">
              服务产品
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-label="幺玖玖品牌策划 logo">
          <img src="/brand/hero-auxiliary.svg" alt="幺玖玖品牌策划辅助图形" />
          <div className="hero__metric">
            <span>{heroMetric.value}</span>
            {heroMetric.label}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="section-head">
          <span>策略定位</span>
          <h2>不是只做一张好看的图，而是建立一套能被持续使用的品牌系统。</h2>
        </div>
        <div className="position-grid">
          {strategyPillars.map((pillar, index) => (
            <Feature icon={[<BarChart3 />, <BriefcaseBusiness />, <Sparkles />, <MessageCircle />][index]} title={pillar.title} key={pillar.title}>
              {pillar.description}
            </Feature>
          ))}
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-head">
          <span>服务板块</span>
          <h2>从品牌战略到视觉落地，把“看起来不错”推进到“记得住、用得上、能传播”。</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <Check size={18} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band band--dark">
        <div className="section-head section-head--light">
          <span>工作方法</span>
          <h2>四步完成从策略判断到视觉落地</h2>
        </div>
        <div className="method-grid">
          {methods.map((method, index) => (
            <div className="method-step" key={method.title}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <h3>{method.title}</h3>
              <p>{method.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--compact">
        <div className="proof-strip">
          {proofItems.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="cases">
        <div className="section-head section-head--row">
          <div>
            <span>案例矩阵</span>
            <h2>从餐饮门店到城市文创，从 IP 形象到科技品牌。</h2>
          </div>
          <button className="button button--ghost" type="button" onClick={() => navigate("/admin")}>
            <LayoutDashboard size={18} />
            上传案例
          </button>
        </div>
        {loading ? (
          <div className="empty-state">正在加载案例...</div>
        ) : cases.length > 0 ? (
          <>
            <div className="category-row">
              {caseCategories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
            <CaseGrid cases={cases} navigate={navigate} />
          </>
        ) : (
          <EmptyCases navigate={navigate} />
        )}
      </section>

      <section className="band">
        <div className="section-head">
          <span>合作流程</span>
          <h2>每一步都对齐商业问题、视觉判断和落地场景。</h2>
        </div>
        <div className="flow">
          {["品牌诊断", "策略定位", "视觉方向", "系统设计", "应用落地"].map((item) => (
            <div className="flow__item" key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>如果你也想先把品牌讲清楚，再把视觉系统做完整</h2>
        <p>可以把你的行业、品牌阶段、现有素材和目标场景发来，我们先判断应该从定位、VI、包装、IP 还是内容切入。</p>
        <button className="button button--primary" type="button" onClick={() => window.dispatchEvent(new Event("openWechat"))}>
          <MessageCircle size={18} />
          微信聊聊
        </button>
      </section>
      <Footer navigate={navigate} />
      <WechatEventBridge />
    </main>
  );
}

function Header({ navigate }: { navigate: (href: string) => void }) {
  return (
    <header className="site-header">
      <button className="brand-mark" type="button" onClick={() => navigate("/")}>
        <img src="/brand/logo.jpg" alt="" />
        <span>{brand.name}</span>
      </button>
      <nav>
        <a href="#services">服务</a>
        <a href="#cases">案例</a>
        <button type="button" onClick={() => navigate("/admin")}>后台</button>
      </nav>
    </header>
  );
}

function Feature({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <article className="feature">
      <div className="feature__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function CaseGrid({ cases, navigate }: { cases: CaseSummary[]; navigate: (href: string) => void }) {
  return (
    <div className="case-grid">
      {cases.map((item) => (
        <article className="case-card" key={item.id}>
          <button type="button" onClick={() => navigate(`/cases/${item.id}`)} aria-label={`查看 ${item.title}`}>
            <img src={item.coverImage || "/brand/logo.jpg"} alt={item.title} />
          </button>
          <div>
            <span>{item.industry} / {item.serviceType}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <button className="text-link" type="button" onClick={() => navigate(`/cases/${item.id}`)}>
              查看案例
              <ArrowRight size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmptyCases({ navigate }: { navigate: (href: string) => void }) {
  return (
    <div className="empty-cases">
      <ImagePlus size={42} />
      <h3>案例库正在等待第一条作品</h3>
      <p>进入后台上传标题、封面、项目背景、解决方案和成果，发布后访客就能在这里看到。</p>
      <button className="button button--primary" type="button" onClick={() => navigate("/admin")}>
        <Plus size={18} />
        上传第一条案例
      </button>
    </div>
  );
}

function CaseDetailPage({ id, navigate }: { id: string; navigate: (href: string) => void }) {
  const [brandCase, setBrandCase] = useState<BrandCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCase(id)
      .then((item) => setBrandCase(withDemoGalleryFallback(item)))
      .catch(() => {
        const demo = demoCases.find((item) => item.id === id) || null;
        setBrandCase(demo);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="page-loader">正在加载案例...</div>;
  }

  if (!brandCase) {
    return (
      <main className="detail-shell">
        <button className="text-link" type="button" onClick={() => navigate("/")}>
          <ChevronLeft size={16} />
          返回首页
        </button>
        <div className="empty-state">这个案例还没有发布。</div>
      </main>
    );
  }

  return (
    <main className="detail-shell">
      <button className="text-link" type="button" onClick={() => navigate("/")}>
        <ChevronLeft size={16} />
        返回首页
      </button>
      <section className="case-hero">
        <div>
          <span>{brandCase.industry} / {brandCase.serviceType}</span>
          <h1>{brandCase.title}</h1>
          <p>{brandCase.summary}</p>
        </div>
        <img src={brandCase.coverImage || "/brand/logo.jpg"} alt={brandCase.title} />
      </section>
      <section className="case-detail-grid">
        <DetailBlock title="客户痛点" content={brandCase.challenge} />
        <DetailBlock title="解决方案" content={brandCase.solution} />
        <ListBlock title="项目成果" items={brandCase.results} />
        <ListBlock title="项目亮点" items={brandCase.highlights} />
      </section>
      {brandCase.videoUrl && (
        <a className="video-link" href={brandCase.videoUrl} target="_blank" rel="noreferrer">
          <Eye size={18} />
          查看视频作品
        </a>
      )}
      {brandCase.gallery.length > 0 && (
        <section className="case-gallery-section">
          <div className="section-head">
            <span>案例作品图集</span>
            <h2>完整展示这个项目的视觉过程与落地应用。</h2>
          </div>
          <div className="gallery">
            {brandCase.gallery.map((image, index) => (
              <button
                className="gallery__item"
                type="button"
                onClick={() => setPreviewImage(image)}
                key={`${image}-${index}`}
                aria-label={`放大查看 ${brandCase.title} 图集 ${index + 1}`}
              >
                <img src={image} alt={`${brandCase.title} 图集 ${index + 1}`} />
              </button>
            ))}
          </div>
        </section>
      )}
      {previewImage && (
        <div className="image-lightbox" role="dialog" aria-modal="true" onClick={() => setPreviewImage(null)}>
          <button className="modal-close" type="button" onClick={() => setPreviewImage(null)} aria-label="关闭">
            <X size={18} />
          </button>
          <img src={previewImage} alt={`${brandCase.title} 放大图`} />
        </div>
      )}
      <section className="cta cta--compact">
        <h2>喜欢这个案例？可以联系我做同款方案。</h2>
        <p>把你的品牌阶段、内容困境和想达成的目标发给我，我们先做一次轻量判断。</p>
      </section>
    </main>
  );
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <article className="detail-block">
      <h2>{title}</h2>
      <p>{content || "后台补充后，这里会显示更完整的项目说明。"}</p>
    </article>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="detail-block">
      <h2>{title}</h2>
      <ul>
        {(items.length ? items : ["后台补充后，这里会显示项目成果。"]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function AdminPage({ navigate }: { navigate: (href: string) => void }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [editing, setEditing] = useState<Partial<BrandCase>>(emptyCase);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const editorRef = useRef<HTMLElement | null>(null);

  const loadCases = async () => {
    const data = await fetchAdminCases(password);
    setCases(mergeWithDemoCases(data.cases, "admin"));
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      const data = await fetchAdminCases(password);
      setCases(mergeWithDemoCases(data.cases, "admin"));
      setAuthed(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败");
    }
  };

  const editExisting = async (id: string) => {
    setBusy(true);
    setMessage("");
    try {
      const item = await fetchAdminCase(password, id);
      setEditing(withDemoGalleryFallback(item));
      scrollToEditor();
    } catch (error) {
      const demo = demoCases.find((item) => item.id === id);
      const summary = cases.find((item) => item.id === id);
      setEditing(demo || { ...emptyCase, ...summary });
      setMessage(demo ? "已载入预置案例，保存后会进入后台案例库。" : "仅加载到案例摘要，可继续覆盖保存。");
      scrollToEditor();
    } finally {
      setBusy(false);
    }
  };

  const newCase = () => {
    setEditing(emptyCase);
    setMessage("已进入新建案例，请填写标题、客户/品牌和案例简介后保存。");
    scrollToEditor();
  };

  const scrollToEditor = () => {
    window.requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const saved = await saveCase(password, editing);
      setEditing(saved);
      await loadCases();
      setMessage("案例已保存并同步到前台。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("确定删除这个案例吗？")) return;
    setBusy(true);
    try {
      await deleteCase(password, id);
      await loadCases();
      if (editing.id === id) setEditing(emptyCase);
      setMessage("案例已删除。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (event: ChangeEvent<HTMLInputElement>, target: "cover" | "gallery") => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setBusy(true);
    setMessage(`正在上传 ${files.length} 张图片，请稍等...`);
    try {
      const uploadedFiles: Array<{ url: string; key: string }> = [];

      for (const file of files) {
        const preparedFile = await prepareImageForUpload(file);
        uploadedFiles.push(await uploadImage(password, preparedFile, editing.id));
      }

      if (target === "cover") {
        setEditing((current) => ({ ...current, coverImage: uploadedFiles[0].url }));
      } else {
        setEditing((current) => ({
          ...current,
          gallery: [...(current.gallery || []), ...uploadedFiles.map((item) => item.url)],
        }));
      }
      setMessage(target === "cover" ? "封面图已上传。保存案例后会展示在前台。" : `已上传 ${uploadedFiles.length} 张图集图片。保存案例后会展示在前台。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    } finally {
      setBusy(false);
    }
  };

  const removeGalleryImage = (image: string) => {
    setEditing((current) => ({
      ...current,
      gallery: (current.gallery || []).filter((item) => item !== image),
    }));
    setMessage("图片已从当前图集中移除，点击“保存案例”后会同步到前台。");
  };

  const clearCoverImage = () => {
    setEditing((current) => ({ ...current, coverImage: "" }));
    setMessage("封面图已移除，点击“保存案例”后会同步到前台。");
  };

  if (!authed) {
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <img src="/brand/logo.jpg" alt="幺玖玖品牌策划" />
          <h1>案例后台</h1>
          <p>输入后台密码后上传和管理案例。正式上线后，密码由 Netlify 环境变量 ADMIN_PASSWORD 控制。</p>
          <label>
            后台密码
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          <button className="button button--primary" type="submit">
            <Lock size={18} />
            进入后台
          </button>
          {message && <div className="form-message">{message}</div>}
          <button className="text-link" type="button" onClick={() => navigate("/")}>
            <ChevronLeft size={16} />
            返回官网
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <button className="text-link" type="button" onClick={() => navigate("/")}>
          <ChevronLeft size={16} />
          返回官网
        </button>
        <h1>案例管理</h1>
        <button className="button button--primary" type="button" onClick={newCase}>
          <Plus size={18} />
          新建案例
        </button>
        <button
          className="text-link"
          type="button"
          onClick={() => {
            setAuthed(false);
            setPassword("");
            setEditing(emptyCase);
          }}
        >
          <Lock size={16} />
          退出后台
        </button>
        <div className="admin-list">
          {cases.map((item) => (
            <div className="admin-case" key={item.id}>
              <button type="button" onClick={() => editExisting(item.id)}>
                <span>{item.title}</span>
                <small>{item.status === "published" ? "已发布" : "草稿"}</small>
              </button>
              <button type="button" onClick={() => remove(item.id)} aria-label="删除案例">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </aside>
      <section className="admin-editor" ref={editorRef}>
        <form onSubmit={submit}>
          <div className="admin-editor__head">
            <div>
              <span>编辑案例</span>
              <h2>{editing.id ? editing.title || "未命名案例" : "新建案例"}</h2>
            </div>
            <button className="button button--primary" type="submit" disabled={busy}>
              <Save size={18} />
              {busy ? "处理中..." : "保存案例"}
            </button>
          </div>
          {message && <div className="form-message">{message}</div>}
          <div className="form-grid">
            <Field label="案例标题" value={editing.title} onChange={(value) => setEditingField(setEditing, "title", value)} />
            <Field label="客户/品牌" value={editing.client} onChange={(value) => setEditingField(setEditing, "client", value)} />
            <Field label="行业标签" value={editing.industry} onChange={(value) => setEditingField(setEditing, "industry", value)} />
            <Field label="服务类型" value={editing.serviceType} onChange={(value) => setEditingField(setEditing, "serviceType", value)} />
            <Field label="案例分类" value={editing.category} onChange={(value) => setEditingField(setEditing, "category", value)} />
            <label>
              发布状态
              <select
                value={editing.status || "published"}
                onChange={(event) => setEditingField(setEditing, "status", event.target.value as BrandCase["status"])}
              >
                <option value="published">发布</option>
                <option value="draft">草稿</option>
              </select>
            </label>
          </div>
          <TextArea label="案例简介" value={editing.summary} onChange={(value) => setEditingField(setEditing, "summary", value)} />
          <TextArea label="客户痛点" value={editing.challenge} onChange={(value) => setEditingField(setEditing, "challenge", value)} />
          <TextArea label="解决方案" value={editing.solution} onChange={(value) => setEditingField(setEditing, "solution", value)} />
          <TextArea label="项目成果（一行一条）" value={(editing.results || []).join("\n")} onChange={(value) => setEditingField(setEditing, "results", splitLines(value))} />
          <TextArea label="项目亮点（一行一条）" value={(editing.highlights || []).join("\n")} onChange={(value) => setEditingField(setEditing, "highlights", splitLines(value))} />
          <Field label="视频外链（可选）" value={editing.videoUrl} onChange={(value) => setEditingField(setEditing, "videoUrl", value)} />
          <div className="upload-row">
            <label className="upload-box">
              <UploadCloud size={20} />
              上传封面图
              <input type="file" accept="image/*" onChange={(event) => onUpload(event, "cover")} />
            </label>
            <label className="upload-box">
              <UploadCloud size={20} />
              上传图集
              <input type="file" accept="image/*" multiple onChange={(event) => onUpload(event, "gallery")} />
            </label>
          </div>
          <div className="asset-preview">
            {editing.coverImage && (
              <div className="asset-item">
                <img src={assetUrl(editing.coverImage)} alt="案例封面" />
                <span>封面</span>
                <button type="button" onClick={clearCoverImage} aria-label="删除封面图">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {(editing.gallery || []).map((image, index) => (
              <div className="asset-item" key={`${image}-${index}`}>
                <img src={assetUrl(image)} alt={`案例图集 ${index + 1}`} />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <button type="button" onClick={() => removeGalleryImage(image)} aria-label={`删除图集图片 ${index + 1}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} rows={4} />
    </label>
  );
}

function withDemoGalleryFallback(brandCase: BrandCase) {
  const demo = demoCases.find((item) => item.id === brandCase.id);

  if (!demo || brandCase.gallery.length > 1) {
    return brandCase;
  }

  return {
    ...brandCase,
    gallery: demo.gallery,
  };
}

function mergeWithDemoCases(cloudCases: CaseSummary[], mode: "admin" | "published") {
  const cloudById = new Map(cloudCases.map((item) => [item.id, item]));
  const merged = demoCases
    .map((item) => cloudById.get(item.id) || item)
    .filter((item) => mode === "admin" || item.status === "published");

  cloudCases.forEach((item) => {
    if (!demoCases.some((demo) => demo.id === item.id) && (mode === "admin" || item.status === "published")) {
      merged.push(item);
    }
  });

  return merged;
}

function buildProofItems(cases: CaseSummary[]) {
  const activeCases = cases.length ? cases : demoCases;
  const industries = uniqueFilled(activeCases.map((item) => item.industry));
  const serviceKeywords = summarizeServices(activeCases.map((item) => item.serviceType));
  const latest = [...activeCases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

  return [
    { value: String(activeCases.length), label: "组真实案例" },
    { value: String(industries.length), label: "类品牌场景" },
    { value: serviceKeywords.value, label: serviceKeywords.label },
    { value: "最新", label: latest?.title || "案例持续更新" },
  ];
}

function buildHeroMetric(cases: CaseSummary[]) {
  const activeCases = cases.length ? cases : demoCases;
  const industries = uniqueFilled(activeCases.map((item) => item.industry));
  const featuredIndustries = industries.slice(0, 4).join("、") || "餐饮、文创、科技与 IP";

  return {
    value: `${activeCases.length}组案例`,
    label: `覆盖${featuredIndustries}`,
  };
}

function uniqueFilled(values: string[]) {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function summarizeServices(values: string[]) {
  const text = values.join(" / ");
  const tags = [
    ["VI", "VI"],
    ["包装", "包装"],
    ["IP", "IP"],
    ["界面", "界面"],
    ["视频", "视频"],
    ["策略", "策略"],
  ].filter(([keyword]) => text.includes(keyword));
  const selected = tags.slice(0, 4).map(([, label]) => label);

  return {
    value: selected[0] || "服务",
    label: selected.length ? selected.join("/") : "策略/视觉/内容",
  };
}

function setEditingField<T extends keyof BrandCase>(
  setEditing: Dispatch<SetStateAction<Partial<BrandCase>>>,
  key: T,
  value: Partial<BrandCase>[T],
) {
  setEditing((current) => ({ ...current, [key]: value }));
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function assetUrl(url: string) {
  if (!url.startsWith("/api/assets/")) {
    return url;
  }

  return `${url}?v=${Date.now()}`;
}

async function prepareImageForUpload(file: File) {
  const shouldCompress = file.size > 4 * 1024 * 1024;
  if (!shouldCompress || !file.type.startsWith("image/")) {
    return file;
  }

  const image = await loadImage(file);
  const maxSide = 2400;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.9);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片读取失败，请换一张图片重试"));
    };
    image.src = url;
  });
}

function WechatModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="wechat-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="关闭">
          <X size={18} />
        </button>
        <img src={brand.qr} alt="微信二维码" />
        <h2>微信咨询</h2>
        <p>{brand.wechat}</p>
        <small>把品牌阶段、想拍的内容和预算区间发来，我会先判断适合的启动方式。</small>
      </div>
    </div>
  );
}

function WechatEventBridge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = () => setOpen(true);
    window.addEventListener("openWechat", listener);
    return () => window.removeEventListener("openWechat", listener);
  }, []);

  return open ? <WechatModal onClose={() => setOpen(false)} /> : null;
}

function Footer({ navigate }: { navigate: (href: string) => void }) {
  return (
    <footer>
      <button className="brand-mark" type="button" onClick={() => navigate("/")}>
        <img src="/brand/logo.jpg" alt="" />
        <span>{brand.name}</span>
      </button>
      <p>能力驱动、客户导向、分阶段迭代。</p>
    </footer>
  );
}
