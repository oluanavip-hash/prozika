import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { Team } from '../types';
import { Loader2, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';

interface HomeContext {
  selectedLeague: number | 'all';
  handleAddToCart: (team: Team) => void;
  searchTerm: string;
}

const TEAMS_PER_PAGE = 10;

const Home: React.FC = () => {
  const { selectedLeague, handleAddToCart, searchTerm } = useOutletContext<HomeContext>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImageToggled, setIsImageToggled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIsImageToggled(prev => !prev), 10000);
    return () => clearInterval(interval);
  }, []);

  // Reset page when league or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLeague, searchTerm]);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);

      const from = (currentPage - 1) * TEAMS_PER_PAGE;
      const to = from + TEAMS_PER_PAGE - 1;

      // Base query for count
      let countQuery = supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      // Base query for data
      let dataQuery = supabase
        .from('teams')
        .select(`*, leagues(name), product_stock(*)`);

      if (selectedLeague !== 'all') {
        countQuery = countQuery.eq('league_id', selectedLeague);
        dataQuery = dataQuery.eq('league_id', selectedLeague);
      }

      if (searchTerm) {
        countQuery = countQuery.ilike('name', `%${searchTerm}%`);
        dataQuery = dataQuery.ilike('name', `%${searchTerm}%`);
      }

      // Get total count for pagination
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error fetching teams count:', countError);
      } else {
        setTotalTeams(count || 0);
      }
      
      // Fetch paginated data
      const { data, error } = await dataQuery
        .range(from, to)
        .order('name');

      if (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      } else {
        const teamsWithStock = data?.map(team => ({
          ...team,
          stock: team.product_stock || []
        })) || [];
        setTeams(teamsWithStock);
      }
      setLoading(false);
    };

    fetchTeams();
  }, [selectedLeague, currentPage, searchTerm]);

  const totalPages = Math.ceil(totalTeams / TEAMS_PER_PAGE);

  return (
    <div className="container mx-auto py-8">
      <HeroBanner />
      <div className="px-4">
        <div className="my-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Coleção Torcedor 25/26
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            As melhores camisetas de time com qualidade tailandesa. Encontre a camisa do seu time favorito!
          </p>
          
          <div className="mt-4 flex justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-blue-700 font-medium">Estoques atualizados em tempo real</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-red-600" size={48} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {teams.map((team) => (
                <ProductCard
                  key={team.id}
                  team={team}
                  onAddToCart={handleAddToCart}
                  isImageToggled={isImageToggled}
                />
              ))}
            </div>

            {teams.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <SearchX size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500">
                  {searchTerm ? 'Nenhum resultado para sua busca.' : 'Nenhum time encontrado nesta categoria.'}
                </p>
                {searchTerm && <p className="text-gray-400 mt-2">Tente pesquisar por outro termo.</p>}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={20} />
                  Anterior
                </button>
                <span className="font-semibold text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  aria-label="Próxima página"
                >
                  Próxima
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
