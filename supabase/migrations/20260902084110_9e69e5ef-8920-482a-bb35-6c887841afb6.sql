-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- SHARED updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone text,
  town text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'oluochraymond6@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  compare_at integer,
  image_key text,
  image_url text,
  category text NOT NULL DEFAULT 'Women',
  sizes text[] NOT NULL DEFAULT ARRAY['One size']::text[],
  county text NOT NULL DEFAULT 'Nairobi',
  stock integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ORDERS: link to accounts
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id);
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
CREATE POLICY "Customers view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
CREATE POLICY "Customers view their own order items" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- FAVOURITE ORDERS
CREATE TABLE public.favorite_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, order_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorite_orders TO authenticated;
GRANT ALL ON public.favorite_orders TO service_role;
ALTER TABLE public.favorite_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their favourites" ON public.favorite_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add favourites" ON public.favorite_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update favourites" ON public.favorite_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove favourites" ON public.favorite_orders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- SEED CATALOGUE
INSERT INTO public.products (slug, name, subtitle, price, compare_at, image_key, category, sizes, county, stock, sort_order) VALUES
('shati-jua', 'Sun Camp Shirt', 'Short-sleeve men''s shirt', 2800, 3500, 'p1', 'Men', ARRAY['S','M','L','XL']::text[], 'Nairobi', 6, 0),
('gauni-bahari', 'Bahari Maxi Dress', 'One-piece flowing maxi', 4900, NULL, 'p2', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Mombasa', 3, 1),
('kilemba-set', 'Headwrap + Tote Set', 'Matching accessories', 1950, NULL, 'p4', 'Accessories', ARRAY['One size']::text[], 'Nakuru', 12, 2),
('nairobi-wrap-dress', 'Nairobi Wrap Dress', 'Tie-waist midi wrap', 4200, NULL, 'nairobi-wrap-dress', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Nairobi', 9, 3),
('malindi-kaftan', 'Malindi Kaftan', 'Loose coastal kaftan', 3600, NULL, 'malindi-kaftan', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Kilifi', 7, 4),
('eldoret-bomber', 'Eldoret Bomber Jacket', 'Lined kitenge bomber', 5400, 6200, 'eldoret-bomber', 'Men', ARRAY['S','M','L','XL']::text[], 'Uasin Gishu', 5, 5),
('kisii-two-piece', 'Kisii Two-Piece Set', 'Crop top and wide trousers', 5200, NULL, 'kisii-two-piece', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Kisii', 4, 6),
('lamu-shirt-dress', 'Lamu Shirt Dress', 'Button-through shirt dress', 3900, NULL, 'lamu-shirt-dress', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Lamu', 8, 7),
('meru-waistcoat', 'Meru Waistcoat', 'Formal kitenge waistcoat', 3100, NULL, 'meru-waistcoat', 'Men', ARRAY['S','M','L','XL']::text[], 'Meru', 10, 8),
('thika-dashiki', 'Thika Dashiki Top', 'Classic embroidered dashiki', 2400, NULL, 'thika-dashiki', 'Men', ARRAY['S','M','L','XL']::text[], 'Kiambu', 14, 9),
('naivasha-skirt', 'Naivasha A-Line Skirt', 'High-waist midi skirt', 2600, NULL, 'naivasha-skirt', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Nakuru', 11, 10),
('taita-safari-vest', 'Taita Safari Vest', 'Utility vest with kitenge lining', 3300, NULL, 'taita-safari-vest', 'Men', ARRAY['S','M','L','XL']::text[], 'Taita-Taveta', 8, 11),
('machakos-jumpsuit', 'Machakos Jumpsuit', 'Wide-leg kitenge jumpsuit', 5600, NULL, 'machakos-jumpsuit', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Machakos', 3, 12),
('garissa-kanzu', 'Garissa Long Kanzu', 'Trimmed formal kanzu', 4700, NULL, 'garissa-kanzu', 'Men', ARRAY['S','M','L','XL']::text[], 'Garissa', 5, 13),
('nyeri-peplum', 'Nyeri Peplum Top', 'Structured peplum blouse', 2900, NULL, 'nyeri-peplum', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Nyeri', 9, 14),
('kericho-trench', 'Kericho Trench Coat', 'Lightweight printed trench', 7200, NULL, 'kericho-trench', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Kericho', 2, 15),
('turkana-poncho', 'Turkana Poncho', 'Loose printed poncho', 3300, NULL, 'turkana-poncho', 'Women', ARRAY['One size']::text[], 'Turkana', 7, 16),
('bungoma-shorts', 'Bungoma Tailored Shorts', 'Knee-length kitenge shorts', 2100, NULL, 'bungoma-shorts', 'Men', ARRAY['S','M','L','XL']::text[], 'Bungoma', 13, 17),
('kakamega-shuka-shirt', 'Kakamega Long Shirt', 'Long-sleeve print shirt', 3200, NULL, 'kakamega-shirt', 'Men', ARRAY['S','M','L','XL']::text[], 'Kakamega', 8, 18),
('embu-headwrap', 'Embu Headwrap', 'Pre-tied gele headwrap', 900, NULL, 'embu-headwrap', 'Accessories', ARRAY['One size']::text[], 'Embu', 25, 19),
('kitui-tote', 'Kitui Market Tote', 'Lined kitenge tote bag', 1500, NULL, 'kitui-tote', 'Accessories', ARRAY['One size']::text[], 'Kitui', 18, 20),
('mombasa-bow-tie', 'Mombasa Bow Tie & Pocket Square', 'Groomsmen accessory pair', 1200, NULL, 'mombasa-bow-tie', 'Accessories', ARRAY['One size']::text[], 'Mombasa', 20, 21),
('isiolo-sandals', 'Isiolo Print Sandals', 'Kitenge-wrapped flat sandals', 2200, NULL, 'isiolo-sandals', 'Accessories', ARRAY['36','37','38','39','40']::text[], 'Isiolo', 10, 22),
('homabay-scrunchies', 'Homa Bay Scrunchie Pack', 'Set of five print scrunchies', 600, NULL, 'homabay-scrunchies', 'Accessories', ARRAY['One size']::text[], 'Homa Bay', 30, 23),
('gikomba-fabric-6m', 'Gikomba Wax Print · 6m', 'Cotton wax fabric by the roll', 3500, NULL, 'fabric', 'Fabric', ARRAY['6 metres']::text[], 'Nairobi', 15, 24),
('kongowea-fabric-3m', 'Kongowea Wax Print · 3m', 'Cotton wax fabric half roll', 1900, NULL, 'kongowea-fabric', 'Fabric', ARRAY['3 metres']::text[], 'Mombasa', 22, 25),
('nakuru-double-breasted', 'Nakuru Double-Breasted Jacket', 'Structured print suit jacket', 6800, 7600, 'nakuru-double-breasted', 'Men', ARRAY['S','M','L','XL']::text[], 'Nakuru', 6, 26),
('siaya-print-hoodie', 'Siaya Print Hoodie', 'Panelled cotton hoodie', 3900, NULL, 'siaya-print-hoodie', 'Men', ARRAY['S','M','L','XL']::text[], 'Siaya', 10, 27),
('narok-print-trousers', 'Narok Print Trousers', 'Tapered tailored trousers', 3400, NULL, 'narok-print-trousers', 'Men', ARRAY['S','M','L','XL']::text[], 'Narok', 9, 28),
('busia-overshirt', 'Busia Overshirt', 'Boxy button-up overshirt', 3000, NULL, 'busia-overshirt', 'Men', ARRAY['S','M','L','XL']::text[], 'Busia', 12, 29),
('wajir-tunic', 'Wajir Mandarin Tunic', 'Short-sleeve collarless tunic', 2700, NULL, 'wajir-tunic', 'Men', ARRAY['S','M','L','XL']::text[], 'Wajir', 11, 30),
('nandi-track-jacket', 'Nandi Track Jacket', 'Zip jacket with contrast sleeves', 4300, NULL, 'nandi-track-jacket', 'Men', ARRAY['S','M','L','XL']::text[], 'Nandi', 7, 31),
('samburu-robe-coat', 'Samburu Robe Coat', 'Full-length ceremonial robe', 7400, NULL, 'samburu-robe-coat', 'Men', ARRAY['S','M','L','XL']::text[], 'Samburu', 4, 32),
('kilifi-polo', 'Kilifi Print Polo', 'Knit-collar print polo', 2500, NULL, 'kilifi-polo', 'Men', ARRAY['S','M','L','XL']::text[], 'Kilifi', 15, 33),
('vihiga-hat-shirt', 'Vihiga Shirt & Bucket Hat', 'Matching shirt and hat set', 3800, NULL, 'vihiga-hat-shirt', 'Men', ARRAY['S','M','L','XL']::text[], 'Vihiga', 8, 34),
('lodwar-coord-set', 'Lodwar Shirt & Shorts Set', 'Two-piece co-ord set', 4100, NULL, 'lodwar-coord-set', 'Men', ARRAY['S','M','L','XL']::text[], 'Turkana', 6, 35),
('kajiado-ruffle-gown', 'Kajiado Ruffle Gown', 'Off-shoulder floor-length gown', 6900, NULL, 'kajiado-ruffle-gown', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Kajiado', 5, 36),
('muranga-pencil-dress', 'Murang''a Pencil Dress', 'Fitted cap-sleeve office dress', 4400, NULL, 'muranga-pencil-dress', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Murang''a', 8, 37),
('kiambu-womens-suit', 'Kiambu Blazer Suit', 'Blazer and wide trouser set', 7800, NULL, 'kiambu-womens-suit', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Kiambu', 4, 38),
('nyandarua-tiered-skirt', 'Nyandarua Tiered Skirt', 'Three-tier maxi skirt', 3600, NULL, 'nyandarua-tiered-skirt', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Nyandarua', 9, 39),
('baringo-puff-blouse', 'Baringo Puff-Sleeve Blouse', 'Statement sleeve blouse', 2800, NULL, 'baringo-puff-blouse', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Baringo', 13, 40),
('marsabit-wrap-jumpsuit', 'Marsabit Wrap Jumpsuit', 'Belted wrap jumpsuit', 5300, NULL, 'marsabit-wrap-jumpsuit', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Marsabit', 6, 41),
('tana-kimono-robe', 'Tana Kimono Robe', 'Open-front printed robe', 4600, NULL, 'tana-kimono-robe', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Tana River', 7, 42),
('laikipia-romper', 'Laikipia Romper', 'Relaxed short playsuit', 3100, NULL, 'laikipia-romper', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Laikipia', 10, 43),
('migori-halter-dress', 'Migori Halter Dress', 'Halter-neck pleated midi', 4000, NULL, 'migori-halter-dress', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Migori', 8, 44),
('nyamira-duster-coat', 'Nyamira Duster Coat', 'Colorful printed long duster', 5900, NULL, 'nyamira-duster-coat', 'Women', ARRAY['S','M','L','XL','XXL']::text[], 'Nyamira', 5, 45),
('fabric-indigo-6m', 'Indigo Geometric Wax Print · 6m', 'Cotton wax fabric by the roll', 3600, NULL, 'fabric-indigo-roll', 'Fabric', ARRAY['6 metres']::text[], 'Nairobi', 14, 46),
('fabric-yellow-3m', 'Sunflower Wax Print · 3m', 'Cotton wax fabric half roll', 1950, NULL, 'fabric-yellow-roll', 'Fabric', ARRAY['3 metres']::text[], 'Kisumu', 18, 47),
('fabric-red-6m', 'Crimson Swirl Wax Print · 6m', 'Cotton wax fabric by the roll', 3700, NULL, 'fabric-red-roll', 'Fabric', ARRAY['6 metres']::text[], 'Nakuru', 12, 48),
('fabric-turquoise-3m', 'Coastal Coral Wax Print · 3m', 'Cotton wax fabric half roll', 2000, NULL, 'fabric-turquoise-roll', 'Fabric', ARRAY['3 metres']::text[], 'Mombasa', 16, 49),
('fabric-brown-6m', 'Earth Tribal Wax Print · 6m', 'Cotton wax fabric by the roll', 3400, NULL, 'fabric-brown-roll', 'Fabric', ARRAY['6 metres']::text[], 'Machakos', 11, 50),
('fabric-purple-3m', 'Violet Bloom Wax Print · 3m', 'Cotton wax fabric half roll', 2100, NULL, 'fabric-purple-roll', 'Fabric', ARRAY['3 metres']::text[], 'Eldoret', 13, 51),
('acc-laptop-sleeve', 'Padded Laptop Sleeve', 'Lined 14-inch print sleeve', 1800, NULL, 'acc-laptop-sleeve', 'Accessories', ARRAY['14 inch']::text[], 'Nairobi', 20, 52),
('acc-sling-bag', 'Crossbody Sling Bag', 'Compact print sling bag', 2400, NULL, 'acc-sling-bag', 'Accessories', ARRAY['One size']::text[], 'Kisumu', 14, 53),
('acc-earrings', 'Teardrop Fabric Earrings', 'Lightweight print earrings', 700, NULL, 'acc-earrings', 'Accessories', ARRAY['One size']::text[], 'Nakuru', 30, 54),
('acc-apron', 'Kitchen Print Apron', 'Adjustable cotton apron', 1600, NULL, 'acc-apron', 'Accessories', ARRAY['One size']::text[], 'Thika', 17, 55),
('acc-mask-set', 'Mask & Pocket Square Set', 'Matching two-piece set', 850, NULL, 'acc-mask-set', 'Accessories', ARRAY['One size']::text[], 'Mombasa', 26, 56),
('acc-baby-wrap', 'Baby Carrier Wrap', 'Soft cotton carrying wrap', 1700, NULL, 'acc-baby-wrap', 'Accessories', ARRAY['One size']::text[], 'Kakamega', 19, 57);